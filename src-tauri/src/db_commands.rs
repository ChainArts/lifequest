mod schema;
use chrono::Local;
use serde_json::json;
use serde_json::Number;
use surrealdb::sql::Thing;

use crate::db::LOCAL_DB;

//insert into surrealdb
#[tauri::command]
pub async fn insert_habit(values: schema::Habit) -> surrealdb::Result<()> {
    println!("Inserting habit: {:?}", values);
    let _res: Vec<schema::Habit> = LOCAL_DB.insert("habit").content(json!(values)).await?;
    Ok(())
}

#[tauri::command]
pub async fn get_habits() -> surrealdb::Result<serde_json::Value> {
    let mut res = LOCAL_DB.query("SELECT * FROM habit").await?;

    let habits: Vec<schema::HabitWithId> = res.take(0)?;

    // map over all habits and change the id to a string
    // let habits: Vec<schema::HabitWithId> = habits.into_iter().map(|habit| {
    //     schema::HabitWithId {
    //         id: habit.id.to_string(),
    //         title: habit.title,
    //         goal: habit.goal,
    //         unit: habit.unit,
    //         week_days: habit.week_days,
    //         icon: habit.icon,
    //         color: habit.color,
    //     }
    // }).collect();

    Ok(json!(habits))
}

#[tauri::command]
pub async fn update_habit(values: schema::Habit, id: String) -> surrealdb::Result<()> {
    println!("Updating habit: {:?}", values);
    let _res: Option<schema::Habit> = LOCAL_DB
        .update(("habit", id))
        .content(json!(values))
        .await?;
    Ok(())
}

#[tauri::command]
pub async fn get_single_habit(id: String) -> surrealdb::Result<serde_json::Value> {
    let res: Option<schema::Habit> = LOCAL_DB.select(("habit", id)).await?;
    Ok(json!(res))
}

#[tauri::command]
pub async fn delete_habit(id: String) -> surrealdb::Result<()> {
    println!("Deleting habit and related logs for habit id: {:?}", id);
    // Delete related habit log entries using a delete query on habit_log table
    let _logs_deleted = LOCAL_DB
        .query("DELETE FROM habit_log WHERE habit_id = $habit_id")
        .bind(("habit_id", format!("habit:{}", id)))
        .await?;

    // Now delete the habit itself
    let _res: Option<schema::Habit> = LOCAL_DB.delete(("habit", id)).await?;
    Ok(())
}

#[tauri::command]
pub async fn increase_habit_xp(id: String, exp: Number) -> surrealdb::Result<()> {
    println!(
        "Increasing habit xp for id: {:?} by {:?}",
        (format!("habit:{}", id)),
        exp
    );
    let thing = Thing::from(("habit", id.as_str()));

    let _res = LOCAL_DB
        .query("UPDATE habit SET habit_xp += $exp WHERE id = $id")
        .bind(("exp", exp))
        .bind(("id", thing)) // bind the thing instead of a raw string
        .await?;
    Ok(())
}

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
pub async fn init_user_data() -> surrealdb::Result<serde_json::Value> {
    // 1) try to fetch the one-and-only user
    let mut res = LOCAL_DB.query("SELECT * FROM user LIMIT 1").await?;
    let maybe_user: Option<schema::User> = res.take(0)?;
    // 2) if none exists, insert a default
    let user = if let Some(u) = maybe_user {
        u
    } else {
        let default_user = schema::User {
            exp: 0.into(),
            level: 1.into(),
            current_streak: 0.into(),
            highest_streak: 0.into(),
        };
        // insert returns Vec<schema::User>, take the first element
        let mut inserted: Vec<schema::User> = LOCAL_DB
            .insert("user")
            .content(json!(default_user.clone()))
            .await?;
        inserted.remove(0)
    };
    // 3) hand it back to the front end
    Ok(json!(user))
}

#[tauri::command]
pub async fn get_user_data() -> surrealdb::Result<serde_json::Value> {
    let mut res = LOCAL_DB.query("SELECT * FROM user").await?;
    let user: Option<schema::User> = res.take(0)?;
    Ok(json!(user))
}

#[tauri::command]
pub async fn update_user_data(
    exp: Option<Number>,
    level: Option<Number>,
    current_streak: Option<Number>,
    highest_streak: Option<Number>,
    strategy: String, // "add" | "update" | "reset"
) -> surrealdb::Result<()> {
    println!("Updating user_data with strategy={}", strategy);

    match strategy.as_str() {
        "add" => {
            // for each provided field, we increment
            if let Some(exp) = exp {
                LOCAL_DB
                    .query("UPDATE user SET exp += $exp")
                    .bind(("exp", exp))
                    .await?;
            }
            if let Some(level) = level {
                LOCAL_DB
                    .query("UPDATE user SET level += $level")
                    .bind(("level", level))
                    .await?;
            }
            if let Some(current_streak) = current_streak {
                LOCAL_DB
                    .query("UPDATE user SET current_streak += $c_streak")
                    .bind(("c_streak", current_streak))
                    .await?;
            }
            if let Some(highest_streak) = highest_streak {
                LOCAL_DB
                    .query("UPDATE user SET highest_streak += $h_streak")
                    .bind(("h_streak", highest_streak))
                    .await?;
            }
        }
        "reset_streak" => {
            // ignore incoming values – zero out only the current streak
            LOCAL_DB
                .query("UPDATE user SET current_streak = 0")
                .await?;
        }
        _ /* "update" or anything else */ => {
            // full replace via MERGE for any provided fields
            let mut upd = json!({});
            if let Some(exp) = exp { upd["exp"] = json!(exp); }
            if let Some(level) = level { upd["level"] = json!(level); }
            if let Some(current_streak) = current_streak {
                upd["current_streak"] = json!(current_streak);
            }
            if let Some(highest_streak) = highest_streak {
                upd["highest_streak"] = json!(highest_streak);
            }
            println!("MERGE update_data = {:?}", upd);
            LOCAL_DB
                .query("UPDATE user MERGE $upd")
                .bind(("upd", upd))
                .await?;
        }
    }

    Ok(())
}
