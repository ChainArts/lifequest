mod schema;
use serde_json::json;
use serde_json::Number;
use surrealdb::Datetime;
use surrealdb::sql::Thing;

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
    let mut res = LOCAL_DB
    .query("SELECT * FROM habit WHERE array::at(week_days, $index) = true")
    .bind(("index", today_index))
    .await?;
    let habits: Vec<schema::HabitWithId> = res.take(0)?;
    Ok(json!(habits))
}

#[tauri::command]
pub async fn init_schedule(today: Datetime, habit_id: Thing, goal: Number) -> surrealdb::Result<()> {

    let schedule = schema::Schedule {
        date: today.to_string(),
        habit_id,
        done: 0.into(),
        goal,
        received_reward: false,
        data: 0.into(),
    };
    let _res: Vec<schema::Schedule> = LOCAL_DB.insert("schedule").content(json!(schedule)).await?;
    Ok(())
}

#[tauri::command]
pub async fn get_schedule(habit_id: Thing, date: Datetime) -> surrealdb::Result<serde_json::Value> {
    let mut res = LOCAL_DB
        .query("SELECT * FROM schedule WHERE habit_id = $habit_id AND date = $date")
        .bind(("habit_id", habit_id))
        .bind(("date", date))
        .await?;
    let schedule: Vec<schema::ScheduleWithId> = res.take(0)?;
    Ok(json!(schedule))
}