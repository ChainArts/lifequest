use crate::db::LOCAL_DB;
use crate::db_commands::schema::{Habit, HabitLog};
use chrono::{Duration, NaiveDate};
use rand::Rng;
use serde_json::{json, Number};
use surrealdb::Result;

pub async fn seed_walking_data() -> Result<()> {
    // 1) Insert a single habit with a fixed ID "habit:walking"
    LOCAL_DB
        .insert::<Option<Habit>>(("habit", "walking"))
        .content(json!(Habit {
            title: "walking".to_string(),
            goal: Number::from(100),
            unit: "minutes".to_string(),
            week_days: [true; 7],
            icon: "🚶".to_string(),
            color: "#00FF00".to_string(),
            tracking: true,
            habit_xp: Number::from(10),
            highest_streak: Number::from(0),
            current_streak: Number::from(0),
            last_completed: None,
        }))
        .await?;

    let start_date = NaiveDate::from_ymd_opt(2025, 5, 13).unwrap();

    for days_ago in (0..30).rev() {
        let (progress_val, exp_val, calories) = {
            let mut rng = rand::rng();
            let completed = rng.random_bool(0.7);
            let progress_val = if completed {
                100
            } else {
                rng.random_range(0..100)
            };
            let exp_val = if completed { 10 } else { 0 };
            let calories = (progress_val / 10) * 200;
            (progress_val, exp_val, calories)
        };

        let date = (start_date - Duration::days(days_ago))
            .format("%Y-%m-%d")
            .to_string();

        let log = HabitLog {
            habit_id: "habit:walking".into(),
            date,
            completed: progress_val == 100,
            exp: exp_val.into(),
            progress: progress_val.into(),
            data: Some(calories.into()),
        };

        LOCAL_DB
            .insert::<Vec<HabitLog>>("habit_log")
            .content(json!(log))
            .await?;
    }

    Ok(())
}
