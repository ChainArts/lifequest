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
    println!("Increasing habit xp for id: {:?} by {:?}", (format!("habit:{}", id)), exp);
    let thing = Thing::from(("habit", id.as_str())); 
    
    let _res = LOCAL_DB
        .query("UPDATE habit SET habit_xp += $exp WHERE id = $id")
        .bind(("exp", exp))
        .bind(("id", thing))  // bind the thing instead of a raw string
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
pub async fn sync_habit_log(today_index: Number) -> surrealdb::Result<serde_json::Value> {
    let today_str = Local::now().format("%Y-%m-%d").to_string();

    // Query active habits for today.
    let mut res = LOCAL_DB
        .query("SELECT * FROM habit WHERE array::at(week_days, $index) = true")
        .bind(("index", today_index))
        .await?;
    let active_habits: Vec<schema::HabitWithId> = res.take(0)?;

    let mut output = Vec::new();
    // For each active habit, get its log and merge completed and progress.
    for habit in active_habits {
        let mut log_res = LOCAL_DB
            .query("SELECT * FROM habit_log WHERE habit_id = $habit_id AND date = $date")
            .bind(("habit_id", habit.id.to_string()))
            .bind(("date", today_str.clone()))
            .await?;
        let mut logs: Vec<schema::HabitLog> = log_res.take(0)?;

        let log_entry = if logs.is_empty() {
            // Create a new log if none exists.
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

        // Serialize habit and add completed and progress.
        let mut habit_json = serde_json::to_value(&habit).unwrap();
        if let Some(obj) = habit_json.as_object_mut() {
            obj.insert("completed".to_string(), json!(log_entry.completed));
            obj.insert("progress".to_string(), json!(log_entry.progress));
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
    data: Option<String>,
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
