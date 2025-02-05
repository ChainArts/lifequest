// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::env;
use std::os::windows::process::CommandExt;
use std::process::{Command,Child, Stdio};
use std::thread;
use std::time::Duration;
use std::sync::LazyLock;

use surrealdb::engine::remote::ws::{Client,Ws, Wss};
use surrealdb::opt::auth::Root;
use surrealdb::Surreal;
use dotenv::dotenv;
use winapi::um::winbase::CREATE_NO_WINDOW;

static LOCAL_DB: LazyLock<Surreal<Client>> = LazyLock::new(Surreal::init);
static EXTERNAL_DB: LazyLock<Surreal<Client>> = LazyLock::new(Surreal::init);

struct DatabaseProcess {
    child: Child,
}

impl DatabaseProcess {
    fn new() -> Self {
        let child = Command::new("surreal")
            .args(&[
                "start",
                "--user", &env::var("LOCAL_USERNAME").expect("LOCAL_USERNAME not set"),
                "--pass", &env::var("LOCAL_PASSWORD").expect("LOCAL_PASSWORD not set"),
                "rocksdb:../db/test.db",
                "--log", "debug",
            ])
            .stdout(Stdio::null()) // Redirect stdout to null
            .stderr(Stdio::null()) // Redirect stderr to null
            .creation_flags(CREATE_NO_WINDOW) // Prevent shell window from opening
            .spawn()
            .expect("Failed to start SurrealDB local server");

        DatabaseProcess { child }
    }
}

impl Drop for DatabaseProcess {
    fn drop(&mut self) {
        self.child.kill().expect("Failed to kill SurrealDB process");
        println!("SurrealDB process terminated");
    }
}


#[tokio::main]
async fn main() -> surrealdb::Result<()> {
    dotenv().ok();

    println!("Starting local SurrealDB server");
    let _db_process = DatabaseProcess::new();

    // Allow some time for the local SurrealDB process to start up.
    thread::sleep(Duration::from_millis(250));
    println!("Local SurrealDB server started");


    // Connect to the server
    let local_username = env::var("LOCAL_USERNAME").expect("LOCAL_USERNAME not set");
    let local_password = env::var("LOCAL_PASSWORD").expect("LOCAL_PASSWORD not set");
    LOCAL_DB.connect::<Ws>("127.0.0.1:8000").await?;

    // Signin as a namespace, database, or root user
    LOCAL_DB.signin(Root {
        username: &local_username,
        password: &local_password,
    })
    .await?;

    println!("Connected to local db");

    let external_username = env::var("EXTERNAL_USERNAME").expect("EXTERNAL_USERNAME not set");
    let external_password = env::var("EXTERNAL_PASSWORD").expect("EXTERNAL_PASSWORD not set");

    EXTERNAL_DB.connect::<Wss>("lifequest-db-06acp6cd6du4v8mbo26bhlv1fo.aws-euw1.surreal.cloud").await?;
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
