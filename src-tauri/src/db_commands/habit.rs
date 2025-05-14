use crate::{db::LOCAL_DB, db_commands::schema};
use serde_json::json;
use serde_json::Number;
use surrealdb::sql::Thing;

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
