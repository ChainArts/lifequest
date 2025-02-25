use serde::Deserialize;
// use surrealdb::Surreal;
// use surrealdb::engine::local::{Db, RocksDb};

#[derive(Deserialize, Debug)]
pub struct GoogleUser {
    pub email: String,
    pub name: String,
}

#[tauri::command]
pub fn greet(user: GoogleUser) -> String {
    format!("Hello, {} ({})", user.name, user.email)
}