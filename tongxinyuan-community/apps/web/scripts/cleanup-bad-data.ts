
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

async function main() {
    console.log("🧹 Starting Cleanup...");

    // Auth as Admin
    try {
        await pb.admins.authWithPassword('86152@tongxy.xyz', '1234567890');
    } catch (e) {
        console.error("❌ Admin Auth Failed");
        return;
    }

    const collections = ['volunteer_applications', 'service_consultations'];

    for (const col of collections) {
        try {
            const records = await pb.collection(col).getFullList();
            console.log(`\n📂 Scanning '${col}' (${records.length} records)...`);

            for (const r of records) {
                // Check for empty name or missing created date
                if (!r.name || r.name.trim() === "" || !r.created) {
                    console.log(`   🗑 Deleting Invalid Record: ${r.id} (Name: "${r.name}")`);
                    await pb.collection(col).delete(r.id);
                } else {
                    console.log(`   ✅ Keep: ${r.id} (${r.name})`);
                }
            }
        } catch (e: any) {
            console.error(`❌ Error parsing ${col}:`, e.message);
        }
    }
    console.log("\n✨ Cleanup Complete!");
}

main();
