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
    let mut res = LOCAL_DB.query(query).bind(("zone_id", zone_id.clone())).await?;

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
        let mut verify_res = LOCAL_DB.query(verify_query).bind(("zone_id", zone_id.clone())).await?;
        let verified_zone: Option<schema::Zone> = verify_res.take(0)?;
        println!("After update, zone slots: {:?}", verified_zone.map(|z| z.slots.len()));

        println!("Zone updated successfully");
        return Ok(());
    }

    println!("Zone not found!");
    Ok(()) // You might want to return an error here instead
}