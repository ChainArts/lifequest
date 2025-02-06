// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use dotenv::dotenv;
use std::env;
use std::sync::LazyLock;

use surrealdb::engine::remote::ws::{Client, Wss};
use surrealdb::engine::local::{Db, RocksDb};
use surrealdb::opt::auth::Root;
use surrealdb::Surreal;

static LOCAL_DB: LazyLock<Surreal<Db>> = LazyLock::new(Surreal::init);
static EXTERNAL_DB: LazyLock<Surreal<Client>> = LazyLock::new(Surreal::init);


#[tokio::main]
async fn main() -> surrealdb::Result<()> {
    dotenv().ok();
    LOCAL_DB.connect::<RocksDb>("../db/test.db").await?;

    println!("Connected to local db");
    
    let external_address = env::var("EXTERNAL_ADDRESS").expect("EXTERNAL_ADDRESS not set");
    let external_username = env::var("EXTERNAL_USERNAME").expect("EXTERNAL_USERNAME not set");
    let external_password = env::var("EXTERNAL_PASSWORD").expect("EXTERNAL_PASSWORD not set");

    EXTERNAL_DB.connect::<Wss>(&external_address).await?;
    println!("Connected to external db");
    EXTERNAL_DB.signin(Root {
        username: &external_username,
        password: &external_password,
    }).await?;

    EXTERNAL_DB.use_ns("dev").use_db("lifequest").await?;

    // Test Local DB connection using get to status
    let status = LOCAL_DB.version().await?;
    println!("Local DB status: {:?}", status);

    // Test External DB connection using get to status
    let status = EXTERNAL_DB.version().await?;
    println!("External DB status: {:?}", status);

    
    lifequest_lib::run();
    Ok(())
}
