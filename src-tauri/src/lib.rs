mod db;
mod db_commands;
use dotenv::dotenv;
use std::env;
use surrealdb::engine::local::RocksDb;
use surrealdb::engine::remote::ws::Wss;
use surrealdb::opt::auth::Root;

pub async fn connect_db() -> surrealdb::Result<()> {
    dotenv().ok();
    db::LOCAL_DB.connect::<RocksDb>("../db/test.db").await?;
    db::LOCAL_DB.use_ns("dev").use_db("lifequest").await?;

    println!("Connected to local db");

    let external_address = env::var("EXTERNAL_ADDRESS").expect("EXTERNAL_ADDRESS not set");
    let external_username = env::var("EXTERNAL_USERNAME").expect("EXTERNAL_USERNAME not set");
    let external_password = env::var("EXTERNAL_PASSWORD").expect("EXTERNAL_PASSWORD not set");

    db::EXTERNAL_DB.connect::<Wss>(&external_address).await?;
    println!("Connected to external db");
    db::EXTERNAL_DB
        .signin(Root {
            username: &external_username,
            password: &external_password,
        })
        .await?;

    db::EXTERNAL_DB.use_ns("dev").use_db("lifequest").await?;

    // Test Local DB connection using get to status
    let status = db::LOCAL_DB.version().await?;
    println!("Local DB status: {:?}", status);

    // Test External DB connection using get to status
    let status = db::EXTERNAL_DB.version().await?;
    println!("External DB status: {:?}", status);
    run();
    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            db_commands::greet,
            db_commands::insert_habit,
            db_commands::get_habits,
            db_commands::update_habit,
            db_commands::delete_habit,
            db_commands::get_single_habit
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
