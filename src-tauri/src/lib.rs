use serde::Deserialize;
// use surrealdb::Surreal;
// use surrealdb::engine::local::{Db, RocksDb};

#[derive(Deserialize, Debug)]
pub struct GoogleUser {
    pub email: String,
    pub name: String,
}

#[tauri::command]
fn greet(user: GoogleUser) -> String {
    format!("Hello, {} ({})", user.name, user.email)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
