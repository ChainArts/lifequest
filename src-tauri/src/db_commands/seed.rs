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

use crate::db_commands::schema::{Slot, Zone};

pub async fn seed_zones_and_slots() -> surrealdb::Result<()> {
    let predefined_zones = vec![
        Zone {
            zone_id: "zone-1".to_string(),
            name: "Island 1".to_string(),
            slots: vec![
                Slot {
                    id: "slot-1-1".to_string(),
                    position: json!({ "x": -2.5, "y": 0, "z": 3.1 }),
                    animal: "chicken".to_string(),
                    enabled: false,
                },
                Slot {
                    id: "slot-1-2".to_string(),
                    position: json!({ "x": 2.3, "y": -1.7, "z": 2.3 }),
                    animal: "fox".to_string(),
                    enabled: false,
                },
                Slot {
                    id: "slot-1-3".to_string(),
                    position: json!({ "x": 0.0, "y": 4.2, "z": 4.0 }),
                    animal: "chicken".to_string(),
                    enabled: false,
                },
                Slot {
                    id: "slot-1-4".to_string(),
                    position: json!({ "x": 3.8, "y": -1.55, "z": 0 }),
                    animal: "fox".to_string(),
                    enabled: false,
                },
                Slot {
                    id: "slot-1-5".to_string(),
                    position: json!({ "x": -3.3, "y": 2.2, "z": -2.7 }),
                    animal: "chicken".to_string(),
                    enabled: false,
                },
                Slot {
                    id: "slot-1-6".to_string(),
                    position: json!({ "x": 2, "y": -1.4, "z": -3.0 }),
                    animal: "duck".to_string(),
                    enabled: false,
                },
                Slot {
                    id: "slot-1-7".to_string(),
                    position: json!({ "x": 0, "y": -1.6, "z": 0 }),
                    animal: "duck".to_string(),
                    enabled: false,
                },
            ],
        },
        Zone {
            zone_id: "zone-2".to_string(),
            name: "Island 2".to_string(),
            slots: vec![
                Slot {
                    id: "slot-2-1".to_string(),
                    position: json!({ "x": -9.27, "y": 3.41, "z": -12.1 }),
                    animal: "fox".to_string(),
                    enabled: false,
                },
                Slot {
                    id: "slot-2-2".to_string(),
                    position: json!({ "x": -9.0, "y": 9.2, "z": -6.0 }),
                    animal: "chicken".to_string(),
                    enabled: false,
                },
                Slot {
                    id: "slot-2-3".to_string(),
                    position: json!({ "x": -8.1, "y": 3.47, "z": -13.14 }),
                    animal: "fox".to_string(),
                    enabled: false,
                },
                Slot {
                    id: "slot-2-4".to_string(),
                    position: json!({ "x": -11.5, "y": 9.2, "z": -13.8 }),
                    animal: "chicken".to_string(),
                    enabled: false,
                },
                Slot {
                    id: "slot-2-5".to_string(),
                    position: json!({ "x": -10.56, "y": 3.96, "z": -6.44 }),
                    animal: "fox".to_string(),
                    enabled: false,
                },
                Slot {
                    id: "slot-2-6".to_string(),
                    position: json!({ "x": -7.1, "y": 3.47, "z": -7.7 }),
                    animal: "duck".to_string(),
                    enabled: false,
                },
                Slot {
                    id: "slot-2-7".to_string(),
                    position: json!({ "x": -6.1, "y": 3.47, "z": -10.14 }),
                    animal: "duck".to_string(),
                    enabled: false,
                },
            ],
        },
        Zone {
            zone_id: "zone-3".to_string(),
            name: "Island 3".to_string(),
            slots: vec![
                Slot {
                    id: "slot-3-1".to_string(),
                    position: json!({ "x": -7.3, "y": 6.2, "z": 8.5 }),
                    animal: "chicken".to_string(),
                    enabled: false,
                },
                Slot {
                    id: "slot-3-2".to_string(),
                    position: json!({ "x": -8.5, "y": 0.35, "z": 8.8 }),
                    animal: "fox".to_string(),
                    enabled: false,
                },
                Slot {
                    id: "slot-3-3".to_string(),
                    position: json!({ "x": -10.5, "y": 2.5, "z": 11.0 }),
                    animal: "chicken".to_string(),
                    enabled: false,
                },
                Slot {
                    id: "slot-3-4".to_string(),
                    position: json!({ "x": -7.14, "y": 0.31, "z": 11.65 }),
                    animal: "fox".to_string(),
                    enabled: false,
                },
                Slot {
                    id: "slot-3-5".to_string(),
                    position: json!({ "x": -6.0, "y": 1.2, "z": 14.0 }),
                    animal: "chicken".to_string(),
                    enabled: false,
                },
                Slot {
                    id: "slot-3-6".to_string(),
                    position: json!({ "x": -10.5, "y": 0.31, "z": 12.0 }),
                    animal: "duck".to_string(),
                    enabled: false,
                },
                Slot {
                    id: "slot-3-7".to_string(),
                    position: json!({ "x": -11.14, "y": 0.61, "z": 8.5 }),
                    animal: "duck".to_string(),
                    enabled: false,
                },
            ],
        },
    ];

    for zone in predefined_zones {
        // Check if the zone already exists
        let query = "SELECT * FROM zone WHERE zone_id = $zone_id";
        let zone_id = zone.zone_id.clone();
        println!("Checking for existing zone with ID: {}", zone_id);
        let mut res = LOCAL_DB
            .query(query)
            .bind(("zone_id", zone_id))
            .await?;
        let existing_zone: Option<Zone> = res.take(0)?;

        // If the zone doesn't exist, insert it
        if existing_zone.is_none() {
            LOCAL_DB
                .insert::<Vec<Zone>>("zone")
                .content(json!(zone))
                .await?;
        }
    }

    Ok(())
}
