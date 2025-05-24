use serde_json::json;

use crate::{db::LOCAL_DB, db_commands::schema};

#[tauri::command]
pub async fn get_zones() -> surrealdb::Result<serde_json::Value> {
    let mut res = LOCAL_DB.query("SELECT * FROM zone").await?;
    let zones: Vec<schema::Zone> = res.take(0)?;
    Ok(serde_json::json!(zones)) // Serialize zones as JSON
}

#[tauri::command]
pub async fn toggle_slot(zone_id: String, slot_id: String) -> surrealdb::Result<()> {
    println!("Toggling slot: {} in zone: {}", slot_id, zone_id);

    // Fetch the zone
    let query = "SELECT * FROM zone WHERE zone_id = $zone_id";
    let mut res = LOCAL_DB
        .query(query)
        .bind(("zone_id", zone_id.clone()))
        .await?;

    let mut zone: Option<schema::Zone> = res.take(0)?;

    if let Some(ref mut zone) = zone {
        // Find and update the specific slot
        for slot in &mut zone.slots {
            if slot.id == slot_id {
                slot.enabled = !slot.enabled;
                println!("Updated slot {} to enabled: {}", slot_id, slot.enabled);
                break;
            }
        }

        // Save the updated zone using the update builder
        LOCAL_DB
            .query("UPDATE zone SET slots = $slots WHERE zone_id = $zone_id")
            .bind(("slots", json!(zone.slots)))
            .bind(("zone_id", zone_id.clone()))
            .await?;

        // Verify the update
        let verify_query = "SELECT * FROM zone WHERE zone_id = $zone_id";
        let mut verify_res = LOCAL_DB
            .query(verify_query)
            .bind(("zone_id", zone_id.clone()))
            .await?;
        let verified_zone: Option<schema::Zone> = verify_res.take(0)?;
        println!(
            "After update, zone slots: {:?}",
            verified_zone.map(|z| z.slots.len())
        );

        println!("Zone updated successfully");
        return Ok(());
    }

    println!("Zone not found!");
    Ok(()) // You might want to return an error here instead
}

#[tauri::command]
pub async fn get_animal_inventory() -> surrealdb::Result<serde_json::Value> {
    let mut res = LOCAL_DB.query("SELECT * FROM animal_inventory").await?;
    let inventory: Vec<schema::AnimalInventory> = res.take(0)?;

    // If no inventory exists, seed with default (1 free chicken)
    if inventory.is_empty() {
        let default_animals = vec![
            schema::AnimalInventory {
                id: None,
                animal_type: "chicken".to_string(),
                owned: 1,
            },
            schema::AnimalInventory {
                id: None,
                animal_type: "fox".to_string(),
                owned: 0,
            },
            schema::AnimalInventory {
                id: None,
                animal_type: "duck".to_string(),
                owned: 0,
            },
        ];

        for animal in &default_animals {
            LOCAL_DB
                .create::<Option<schema::AnimalInventory>>("animal_inventory")
                .content(json!(animal))
                .await?;
        }

        return Ok(json!(default_animals));
    }

    Ok(json!(inventory))
}

#[tauri::command]
pub async fn buy_animal(animal_type: String, price: i32) -> surrealdb::Result<()> {
    println!("Buying animal: {} for price: {}", animal_type, price);

    // 1. Check if user has enough coins
    let mut user_res = LOCAL_DB
        .query("SELECT VALUE coins FROM user LIMIT 1")
        .await?;
    let user_coins: Option<i32> = user_res.take(0)?;

    if let Some(coins) = user_coins {
        if coins < price {
            return Err(surrealdb::Error::Api(surrealdb::error::Api::Query(
                "Insufficient coins".to_string(),
            )));
        }
    } else {
        return Err(surrealdb::Error::Api(surrealdb::error::Api::Query(
            "User not found".to_string(),
        )));
    }

    // 2. Deduct coins from user
    LOCAL_DB
        .query("UPDATE user SET coins -= $price")
        .bind(("price", price))
        .await?;

    // 3. Increment animal count
    LOCAL_DB
        .query("UPDATE animal_inventory SET owned += 1 WHERE animal_type = $animal_type")
        .bind(("animal_type", animal_type))
        .await?;

    Ok(())
}

#[tauri::command]
pub async fn get_animal_count(animal_type: String) -> surrealdb::Result<i32> {
    let mut res = LOCAL_DB
        .query("SELECT VALUE owned FROM animal_inventory WHERE animal_type = $animal_type")
        .bind(("animal_type", animal_type))
        .await?;

    let count: Option<i32> = res.take(0)?;
    Ok(count.unwrap_or(0))
}
