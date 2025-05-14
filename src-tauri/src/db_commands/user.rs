use crate::{
    db::LOCAL_DB,
    db_commands::{schema, seed::seed_walking_data},
};
use chrono::Local;
use serde_json::{json, Number};

#[tauri::command]
pub async fn init_user_data() -> surrealdb::Result<serde_json::Value> {
    // 1) try to fetch the one-and-only user
    let mut res = LOCAL_DB.query("SELECT * FROM user LIMIT 1").await?;
    let maybe_user: Option<schema::User> = res.take(0)?;
    // 2) if none exists, insert a default
    let user = if let Some(u) = maybe_user {
        u
    } else {
        let default_user = schema::User {
            exp: 0.into(),
            level: 1.into(),
            current_streak: 0.into(),
            highest_streak: 0.into(),
            coins: 0.into(),
            last_streak: "".to_string(),
        };
        // insert returns Vec<schema::User>, take the first element
        let mut inserted: Vec<schema::User> = LOCAL_DB
            .insert("user")
            .content(json!(default_user.clone()))
            .await?;
        inserted.remove(0)
    };
    // 3) hand it back to the front end
    Ok(json!(user))
}

#[tauri::command]
pub async fn get_user_data() -> surrealdb::Result<serde_json::Value> {
    let mut res = LOCAL_DB.query("SELECT * FROM user").await?;
    let user: Option<schema::User> = res.take(0)?;
    Ok(json!(user))
}

#[tauri::command]
pub async fn update_user_data(
    exp: Option<Number>,
    level: Option<Number>,
    currentstreak: Option<Number>,
    higheststreak: Option<Number>,
    coins: Option<Number>,
    strategy: String, // "add" | "update" | "reset"
) -> surrealdb::Result<()> {
    println!("Updating user_data with strategy={}", strategy);

    match strategy.as_str() {
        "add" => {
            // 0) compute today as a string
            let today_str = Local::now().format("%Y-%m-%d").to_string();

            // 1) pull last_streak out of the DB
            let mut streak_res = LOCAL_DB
                .query("SELECT VALUE last_streak FROM user")
                .await?;
            let last_streak: Option<String> = streak_res.take(0)?;
            // only allow a streak‐point if last_streak != today
            let allow_streak = last_streak.as_deref() != Some(&today_str);

            // 2) usual exp/level/coins increments
            if let Some(exp) = exp {
                LOCAL_DB
                    .query("UPDATE user SET exp += $exp")
                    .bind(("exp", exp))
                    .await?;
            }
            if let Some(level) = level {
                LOCAL_DB
                    .query("UPDATE user SET level += $level")
                    .bind(("level", level))
                    .await?;
            }

            // 3) only bump current_streak & highest_streak if we haven’t yet today
            if allow_streak {
                if let Some(current_streak) = currentstreak {
                    LOCAL_DB
                        .query(
                            "UPDATE user SET current_streak += $c_streak, last_streak = $today")
                        .bind(("c_streak", current_streak))
                        .bind(("today", today_str.clone()))
                        .await?;
                }
                if let Some(highest_streak) = higheststreak {
                    LOCAL_DB
                        .query("UPDATE user SET highest_streak += $h_streak")
                        .bind(("h_streak", highest_streak))
                        .await?;
                }
            }

            // 4) coins can always be added
            if let Some(coins) = coins {
                LOCAL_DB
                    .query("UPDATE user SET coins += $coins")
                    .bind(("coins", coins))
                    .await?;
            }
        }
        "reset_streak" => {
            // ignore incoming values – zero out only the current streak
            LOCAL_DB
                .query("UPDATE user SET current_streak = 0")
                .await?;
        }
        _ /* "update" or anything else */ => {
            let today_str = Local::now().format("%Y-%m-%d").to_string();
            let mut streak_res = LOCAL_DB
                .query("SELECT VALUE last_streak FROM user")
                .await?;
            let last_streak: Option<String> = streak_res.take(0)?;
            let allow_streak = last_streak.as_deref() != Some(&today_str);

            // 1) build our MERGE object
            let mut upd = json!({});

            if let Some(exp) = exp {upd["exp"] = json!(exp);}
            if let Some(level) = level {upd["level"] = json!(level);}
            if let Some(coins) = coins {upd["coins"] = json!(coins);
        }

    // 2) only merge streak fields when allowed
            if allow_streak {
                if let Some(c_streak) = currentstreak {
                    upd["current_streak"] = json!(c_streak);
            // record that we've applied today's streak
            upd["last_streak"] = json!(today_str.clone());
        }
        if let Some(h_streak) = higheststreak {
            upd["highest_streak"] = json!(h_streak);
        }
    }
println!("MERGE update_data = {:?}", upd);
    LOCAL_DB
        .query("UPDATE user MERGE $upd")
        .bind(("upd", upd))
        .await?;
            }
        }

    Ok(())
}

#[tauri::command]
pub async fn reset_data() -> surrealdb::Result<()> {
    println!("Resetting all data");
    // Delete all habits and logs
    let _res: Vec<schema::Habit> = LOCAL_DB.delete("habit").await?;
    let _res: Vec<schema::HabitLog> = LOCAL_DB.delete("habit_log").await?;
    // Reset user data
    let _res: Vec<schema::User> = LOCAL_DB.delete("user").await?;
    seed_walking_data().await?;
    Ok(())
}
