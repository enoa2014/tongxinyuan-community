
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

async function main() {
    console.log("🔑 Authenticating as Admin...");
    await pb.admins.authWithPassword('86152@tongxy.xyz', '1234567890'); // Correct local credentials

    const collections = ['volunteer_applications', 'service_consultations'];

    for (const name of collections) {
        console.log(`\n📂 Updating collection: ${name}...`);
        try {
            const collection = await pb.collections.getOne(name);

            // Check if history field exists
            const hasHistory = collection.schema.find((f: any) => f.name === 'history');

            if (hasHistory) {
                console.log(`   ✅ 'history' field already exists.`);
            } else {
                console.log(`   ➕ Adding 'history' field (JSON)...`);

                // Add new field
                collection.schema.push({
                    system: false,
                    id: `history_${Date.now()}`,
                    name: 'history',
                    type: 'json',
                    required: false,
                    presentable: false,
                    unique: false,
                    options: {
                        maxSize: 2000000
                    }
                });

                await pb.collections.update(collection.id, collection);
                console.log(`   ✅ Schema updated successfully!`);
            }
        } catch (e: any) {
            console.error(`   ❌ Failed to update ${name}:`, e.message);
        }
    }
}

main();
