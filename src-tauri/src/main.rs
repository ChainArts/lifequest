// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use surrealdb::engine::any;
use surrealdb::engine::remote::ws::Ws;
use surrealdb::opt::auth::Root;
use surrealdb::Surreal;
use dotenv::dotenv;
use std::env;

#[tokio::main]
async fn main() -> surrealdb::Result<()> {
    dotenv().ok();

    println!("Starting");
    // Connect to the server
    let local_username = env::var("LOCAL_USERNAME").expect("LOCAL_USERNAME not set");
    let local_password = env::var("LOCAL_PASSWORD").expect("LOCAL_PASSWORD not set");
    let db = Surreal::new::<Ws>("127.0.0.1:8000").await?;

    // Signin as a namespace, database, or root user
    db.signin(Root {
        username: &local_username,
        password: &local_password,
    })
    .await?;

    println!("Connected to local db");

    let external_username = env::var("EXTERNAL_USERNAME").expect("EXTERNAL_USERNAME not set");
    let external_password = env::var("EXTERNAL_PASSWORD").expect("EXTERNAL_PASSWORD not set");

    let external_db = any::connect("wss://lifequest-db-06acp6cd6du4v8mbo26bhlv1fo.aws-euw1.surreal.cloud").await?;
    println!("Connected to external db");
    external_db.signin(Root {
        username: &external_username,
        password: &external_password,
    }).await?;

    external_db.use_ns("dev").use_db("lifequest").await?;
    
    lifequest_lib::run();
    Ok(())
}
