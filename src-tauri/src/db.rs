use std::sync::LazyLock;

use surrealdb::engine::local::Db;
use surrealdb::engine::remote::ws::Client;
use surrealdb::Surreal;


pub static LOCAL_DB: LazyLock<Surreal<Db>> = LazyLock::new(Surreal::init);
pub static EXTERNAL_DB: LazyLock<Surreal<Client>> = LazyLock::new(Surreal::init);

