
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');
const ADMIN_EMAIL = '86152@tongxy.xyz';
const ADMIN_PASS = '1234567890';

async function main() {
    console.log("🔒 Updating Database Permissions...");

    try {
        await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASS);
        console.log("✅ Auth Successful.");

        // 1. Fix 'services' collection
        try {
            const collection = await pb.collections.getOne('services');

            // Allow public read access (empty string = public)
            collection.listRule = "";
            collection.viewRule = "";

            await pb.collections.update(collection.id, collection);
            console.log("✅ [services] Public read access enabled.");
        } catch (e: any) {
            console.error(`❌ [services] Failed to update: ${e.message}`);
        }

        // 2. Check 'news' collection rules (just in case)
        try {
            const collection = await pb.collections.getOne('news');
            if (collection.listRule === null || collection.viewRule === null) {
                console.log("ℹ️ [news] Rules were restrictive. Opening up...");
                collection.listRule = "";
                collection.viewRule = "";
                await pb.collections.update(collection.id, collection);
                console.log("✅ [news] Public read access enabled.");
            } else {
                console.log(`ℹ️ [news] Permissions already set (List: "${collection.listRule}")`);
            }
        } catch (e: any) {
            console.error(`❌ [news] Failed to check: ${e.message}`);
        }

    } catch (e) {
        console.error("❌ Fatal Error:", e);
    }
}

main();
