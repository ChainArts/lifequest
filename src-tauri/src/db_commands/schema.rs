use serde::{Deserialize, Serialize};
use serde_json::Number;
use surrealdb::sql::Thing;

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct Habit {
    pub title: String,
    pub goal: Number,
    pub unit: String,
    pub week_days: [bool; 7],
    pub icon: String,
    pub color: String,
    pub tracking: bool,
    pub habit_xp: Number,
    pub highest_streak: Number,
    pub current_streak: Number,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub last_completed: Option<String>,
}

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct HabitWithId {
    #[serde(flatten)]
    pub habit: Habit,
    pub id: Thing,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct HabitLog {
    pub habit_id: String,
    pub date: String,
    pub completed: bool,
    pub exp: Number,
    pub progress: Number,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub data: Option<String>,
}

#[derive(Serialize, Deserialize, Debug)]
pub struct HabitLogWithId {
    #[serde(flatten)]
    pub habit_log: HabitLog,
    pub id: Thing,
}