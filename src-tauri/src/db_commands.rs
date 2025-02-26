mod schema;
use serde_json::json;

use crate::db::LOCAL_DB;

#[tauri::command]
pub fn greet(user: schema::GoogleUser) -> String {
    format!("Hello, {} ({})", user.name, user.email)
}

//insert into surrealdb
#[tauri::command]
pub async fn insert_habit(values: schema::Habit) -> surrealdb::Result<()> {
    println!("Inserting habit: {:?}", values);
    let _res: Vec<schema::Habit> = LOCAL_DB.insert("habit")
        .content(json!(values))
        .await?;
    Ok(())
}

#[tauri::command]
pub async fn get_habits() -> surrealdb::Result<Vec<schema::Habit>> {
    let mut res= LOCAL_DB.query("SELECT * FROM habit").await?;

    let habits: Vec<schema::Habit> = res.take(0)?;
    Ok(habits)
}
