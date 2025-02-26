use serde::{Deserialize, Serialize};
use serde_json::Number;
use surrealdb::sql::Thing;


#[derive(Deserialize, Debug)]
pub struct GoogleUser {
    pub email: String,
    pub name: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct Habit {
    pub title: String,
    pub goal: Number,
    pub unit: String,
    pub week_days: Number,
    pub icon: String,
    pub color: String,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct HabitWithId {
    pub id: Thing,
    pub title: String,
    pub goal: Number,
    pub unit: String,
    pub week_days: Number,
    pub icon: String,
    pub color: String,
}