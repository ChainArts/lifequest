mod db;
mod db_commands;
use dotenv::dotenv;
use std::env;
use surrealdb::engine::local::RocksDb;
use tauri::Manager;

pub async fn connect_db() {
    dotenv().ok();
    run();
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .setup(|app| {
            let handle = app.handle().clone();
            tauri::async_runtime::spawn(async move {
                // 1. Resolve a writable data directory everywhere
                let base = handle
                    .path()
                    .app_local_data_dir()
                    .expect("couldn't resolve app-local-data-dir");

                // 2. Create both the parent AND the surrealdb folder
                let db_folder = base.join("surrealdb");
                std::fs::create_dir_all(&db_folder).expect("failed to create SurrealDB directory");

                // 3. Local RocksDB connect → namespace/db → version
                db::LOCAL_DB
                    .connect::<RocksDb>(db_folder.to_str().unwrap())
                    .await
                    .expect("local DB connect failed");
                db::LOCAL_DB
                    .use_ns("dev")
                    .use_db("lifequest")
                    .await
                    .unwrap();
                println!("✅ Local DB v{:?}", db::LOCAL_DB.version().await.unwrap());
            });
            Ok(())
        })
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            db_commands::insert_habit,
            db_commands::get_habits,
            db_commands::update_habit,
            db_commands::delete_habit,
            db_commands::get_single_habit,
            db_commands::get_todays_habits,
            db_commands::sync_habit_log,
            db_commands::update_habit_log,
            db_commands::get_xp_for_today,
            db_commands::increase_habit_xp,
            db_commands::schedule_habit_for_today,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
