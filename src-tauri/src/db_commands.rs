mod schema;
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
    Ok(json!(habits))
}

#[tauri::command]
pub async fn update_habit(values: schema::Habit, id: String) -> surrealdb::Result<()> {
    println!("Updating habit: {:?}", values); 
    let _res: Option<schema::Habit> = LOCAL_DB.update(("habit", id)).content(json!(values)).await?;
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

    // pase today_index to u8
    let today_index = today_index.as_u64().unwrap() as u8;
    let today_mask = 1 << (7 - today_index);

    // log today_mask as binary
    println!("Today mask: {:07b}", today_mask);

    let mut res = LOCAL_DB.query("SELECT * FROM habit WHERE (week_day & $today_mask) != 0")
        .bind(("today_mask", today_mask))
        .await?;
    let habits: Vec<schema::HabitWithId> = res.take(0)?;
    Ok(json!(habits))
}