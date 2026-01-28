
import PocketBase from 'pocketbase';

async function main() {
    const pb = new PocketBase('http://127.0.0.1:8090');

    console.log("🔑 Authenticating as Admin...");
    try {
        await pb.admins.authWithPassword('86152@tongxy.xyz', '1234567890');
        console.log("✅ Admin Logged In");
    } catch (e) {
        console.error("❌ Admin Login Failed:", e);
        return;
    }

    const collections = ['volunteer_applications', 'service_consultations'];

    for (const name of collections) {
        try {
            console.log(`\n📂 Probing '${name}'...`);
            const collection = await pb.collections.getOne(name);
            console.log(`   Current System Fields: ${collection.system}`);

            if (!collection.system) {
                console.log(`   🛠 Fixing: Enabling System Fields...`);
                // Attempt to update
                await pb.collections.update(collection.id, {
                    system: true
                });
                console.log(`   ✅ Update Success!`);

                // Verify
                const updated = await pb.collections.getOne(name);
                console.log(`   New System Fields: ${updated.system}`);
            } else {
                console.log(`   (Already enabled)`);
            }

        } catch (e: any) {
            console.error(`❌ Failed to fix '${name}':`, e.response?.message || e.message);
        }
    }
}

main();
