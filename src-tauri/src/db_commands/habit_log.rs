use chrono::{Local, Duration};
use serde_json::{json, Number};
use crate::{db::LOCAL_DB, db_commands::schema};


#[tauri::command]
pub async fn get_xp_for_today() -> surrealdb::Result<serde_json::Value> {
    let today_str = Local::now().format("%Y-%m-%d").to_string();
    let mut res = LOCAL_DB
        .query("math::sum(SELECT VALUE exp FROM habit_log WHERE date = $date)")
        .bind(("date", today_str))
        .await?;
    // Directly extract the total as an Option<i64>
    let total: Option<i64> = res.take(0)?;
    println!("Total XP for today: {:?}", total.unwrap_or(0));
    // Return the number, using 0 as a default if total is None
    Ok(json!(total.unwrap_or(0)))
}

#[tauri::command]
pub async fn get_todays_habits(today_index: Number) -> surrealdb::Result<serde_json::Value> {
    let mut res = LOCAL_DB
        .query("SELECT * FROM habit WHERE array::at(week_days, $index) = true")
        .bind(("index", today_index))
        .await?;
    let habits: Vec<schema::HabitWithId> = res.take(0)?;
    Ok(json!(habits))
}

#[tauri::command]
pub async fn schedule_habit_for_today(id: String) -> surrealdb::Result<()> {
    let today_str: String = Local::now().format("%Y-%m-%d").to_string();
    let new_log = schema::HabitLog {
        habit_id: format!("habit:{}", id),
        date: today_str.clone(),
        data: None,
        progress: 0.into(),
        completed: false,
        exp: 0.into(),
    };
    println!("Adding new habit log: {:?}", new_log);
    let _res: Vec<schema::HabitLog> = LOCAL_DB.insert("habit_log").content(json!(new_log)).await?;
    Ok(())
}

#[tauri::command]
pub async fn sync_habit_log(today_index: Number) -> surrealdb::Result<serde_json::Value> {
    let today_str = Local::now().format("%Y-%m-%d").to_string();

    // 1. Get all habit logs for today
    let mut log_res = LOCAL_DB
        .query("SELECT * FROM habit_log WHERE date = $date")
        .bind(("date", today_str.clone()))
        .await?;
    let logs: Vec<schema::HabitLog> = log_res.take(0)?;

    // 2. Query active habits for today based on schedule
    let mut res = LOCAL_DB
        .query("SELECT * FROM habit WHERE array::at(week_days, $index) = true")
        .bind(("index", today_index))
        .await?;
    let active_habits: Vec<schema::HabitWithId> = res.take(0)?;

    // Create a set of habit IDs that are scheduled for today
    let mut habit_ids = std::collections::HashSet::new();
    for habit in &active_habits {
        habit_ids.insert(habit.id.to_string());
    }

    // 3. Find habits that have logs for today but aren't in the active list
    let mut additional_habits = Vec::new();
    let mut habit_log_ids = Vec::new();

    for log in &logs {
        // Extract the ID part from "habit:xxx" format
        if let Some(habit_id) = log.habit_id.strip_prefix("habit:") {
            if !habit_ids.contains(&format!("habit:{}", habit_id)) {
                habit_log_ids.push(habit_id.to_string());
            }
        }
    }

    // If we found additional habit logs, fetch those habits
    if !habit_log_ids.is_empty() {
        for id in habit_log_ids {
            let res: Option<schema::HabitWithId> = LOCAL_DB.select(("habit", id.clone())).await?;
            if let Some(habit) = res {
                additional_habits.push(habit);
            }
        }
    }

    // Combine scheduled habits with habits that have logs for today
    let all_habits = [active_habits, additional_habits].concat();

    let mut output = Vec::new();
    // Process all habits
    for habit in all_habits {
        let mut log_res = LOCAL_DB
            .query("SELECT * FROM habit_log WHERE habit_id = $habit_id AND date = $date")
            .bind(("habit_id", habit.id.to_string()))
            .bind(("date", today_str.clone()))
            .await?;
        let mut logs: Vec<schema::HabitLog> = log_res.take(0)?;

        let log_entry = if logs.is_empty() {
            // Create a new log if none exists
            let new_log = schema::HabitLog {
                habit_id: habit.id.to_string(),
                date: today_str.clone(),
                data: None,
                progress: 0.into(),
                completed: false,
                exp: 0.into(),
            };
            let _inserted_logs: Vec<schema::HabitLog> =
                LOCAL_DB.insert("habit_log").content(json!(new_log)).await?;
            new_log
        } else {
            logs.remove(0)
        };

        // Serialize habit and add completed and progress
        let mut habit_json = serde_json::to_value(&habit).unwrap();
        if let Some(obj) = habit_json.as_object_mut() {
            obj.insert("completed".to_string(), json!(log_entry.completed));
            obj.insert("progress".to_string(), json!(log_entry.progress));
            obj.insert("data".to_string(), json!(log_entry.data));
        }
        output.push(habit_json);
    }
    Ok(json!(output))
}

#[tauri::command]
pub async fn update_habit_log(
    id: String,
    exp: Option<Number>,
    completed: Option<bool>,
    progress: Option<Number>,
    data: Option<Number>,
) -> surrealdb::Result<()> {
    let mut update_data = json!({});

    if let Some(exp) = exp {
        update_data["exp"] = json!(exp);
    }
    if let Some(completed) = completed {
        update_data["completed"] = json!(completed);
    }
    if let Some(progress) = progress {
        update_data["progress"] = json!(progress);
    }
    if let Some(data) = data {
        update_data["data"] = json!(data);
    }
    println!("Updating habit log with id: {:?}", id);
    println!("Update data: {:?}", update_data);

    let today_str = Local::now().format("%Y-%m-%d").to_string();
    let _res = LOCAL_DB
        .query("UPDATE habit_log MERGE $update_data WHERE habit_id = $habit_id AND date = $date")
        .bind(("date", today_str))
        .bind(("update_data", update_data))
        .bind(("habit_id", format!("habit:{}", id)))
        .await?;
    Ok(())
}

#[tauri::command]
pub async fn get_habit_log_completed(id: String) -> surrealdb::Result<bool> {
    println!("Fetching completed status for habit log with id: {:?}", id);
    let today_str = Local::now().format("%Y-%m-%d").to_string();
    let mut res = LOCAL_DB
        .query("SELECT VALUE completed FROM habit_log WHERE habit_id = $habit_id AND date = $date")
        .bind(("habit_id", format!("habit:{}", id)))
        .bind(("date", today_str))
        .await?;
    let completed: Option<bool> = res.take(0)?;
    println!("Completed status: {:?}", completed);
    Ok(completed.unwrap_or(false))
}

#[tauri::command]
pub async fn check_all_today_completed() -> surrealdb::Result<bool> {
    let today_str = Local::now().format("%Y-%m-%d").to_string();
    let mut res = LOCAL_DB
        .query("SELECT VALUE completed FROM habit_log WHERE date = $date")
        .bind(("date", today_str))
        .await?;
    let completed: Vec<bool> = res.take(0)?;
    Ok(completed.iter().all(|&c| c))
}

#[tauri::command]
pub async fn check_all_yesterday_completed() -> surrealdb::Result<bool> {
    let yesterday_str = Local::now()
        .date_naive()
        .pred_opt()
        .unwrap()
        .format("%Y-%m-%d")
        .to_string();
    let mut res = LOCAL_DB
        .query("SELECT VALUE completed FROM habit_log WHERE date = $date")
        .bind(("date", yesterday_str))
        .await?;
    let completed: Vec<bool> = res.take(0)?;
    Ok(completed.iter().all(|&c| c))
}



#[tauri::command]
pub async fn get_habit_log_data(id: String, days: Number) -> surrealdb::Result<serde_json::Value> {
    // 1) compute today and start date
    let today = Local::now().format("%Y-%m-%d").to_string();
    let days_i64 = days.as_i64().unwrap_or(0);
    let start_naive = Local::now()
        .date_naive()
        .checked_sub_signed(Duration::days(days_i64))
        .unwrap();
    let start_date = start_naive.format("%Y-%m-%d").to_string();

    // 2) query date & data for logs between start_date and today
    let mut res = LOCAL_DB
        .query(
            "SELECT date, data 
             FROM habit_log 
             WHERE date >= $start_date AND date <= $today AND habit_id = $habit_id 
             ORDER BY date ASC",
        )
        .bind(("start_date", start_date))
        .bind(("today", today))
        .bind(("habit_id", format!("habit:{}", id)))
        .await?;

    // 3) collect into Vec<serde_json::Value> and return
    let entries: Vec<serde_json::Value> = res.take(0)?;
    Ok(serde_json::json!(entries))
}