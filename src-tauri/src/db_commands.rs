mod schema;
use chrono::Local;
use serde_json::json;
use serde_json::Number;

use crate::db::LOCAL_DB;

#[tauri::command]
pub fn greet(user: schema::GoogleUser) -> String {
    format!("Hello, {} ({})", user.name, user.email)
}

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
    println!("Deleting habit: {:?}", id);
    let _res: Option<schema::Habit> = LOCAL_DB.delete(("habit", id)).await?;
    Ok(())
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
    // Use chrono to get today's date as "YYYY-MM-DD".
    let today_str = Local::now().format("%Y-%m-%d").to_string();

    // Query the habit table to retrieve all active habits for today.
    let mut res = LOCAL_DB
        .query("SELECT * FROM habit WHERE array::at(week_days, $index) = true")
        .bind(("index", today_index))
        .await?;
    let active_habits: Vec<schema::HabitWithId> = res.take(0)?;

    // Vector to store all habit log entries we find or create.
    let mut final_logs: Vec<schema::HabitLog> = Vec::new();

    // For each active habit...
    for habit in &active_habits {
        let query = "SELECT * FROM habit_log WHERE habit_id = $habit_id AND date = $date";
        let mut log_res = LOCAL_DB
            .query(query)
            .bind(("habit_id", habit.id.to_string()))
            .bind(("date", today_str.clone()))
            .await?;
        let logs: Vec<schema::HabitLog> = log_res.take(0)?;

        // If no log exists for this habit for today, insert a new log.
        if logs.is_empty() {
            let new_log = schema::HabitLog {
                habit_id: habit.id.to_string(),
                date: today_str.clone(),
                data: None,
                completed: false,
                xp_earned: Number::from(0),
            };
            // changed from print! to println! to flush output immediately
            println!("Creating new log: {:?}", new_log);
            let inserted_logs: Vec<schema::HabitLog> = LOCAL_DB
                .insert("habit_log").content(json!(new_log)).await?;
            // Optionally change this print! to println! as well
            println!("Inserted new log: {:?}", inserted_logs);
            final_logs.extend(inserted_logs);
        } else {
            // Log entries for today already exist, so add them to our result vector.
            final_logs.extend(logs);
        }
    }
    // Return all habit log entries for today's active habits.
    Ok(json!(final_logs))
}
