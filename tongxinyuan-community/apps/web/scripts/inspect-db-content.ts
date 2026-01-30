
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');
const ADMIN_EMAIL = '86152@tongxy.xyz';
const ADMIN_PASS = '1234567890';

async function main() {
    console.log("🔍 Inspecting Database Collections...");

    try {
        await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASS);
        console.log("✅ Auth Successful.");

        // 1. Check News rules (Just for context)
        try {
            const collection = await pb.collections.getOne('news');
            console.log(`\n📰 News Rules: List='${collection.listRule}'`);
        } catch (e: any) {
            console.log(`\n❌ News Check Failed.`);
        }

        // 2. Check Services Rules & Guest Access
        try {
            const collection = await pb.collections.getOne('services');
            console.log(`\n📋 Rules for [services]:`);
            console.log(`   - listRule: ${JSON.stringify(collection.listRule)}`);
            console.log(`   - viewRule: ${JSON.stringify(collection.viewRule)}`);

            // Simulate Guest Fetch using a separate plain instance
            console.log("\n🕵️ Testing Guest Access (Anonymous)...");
            const guestPb = new PocketBase('http://127.0.0.1:8090');

            // Test 1: No Sort
            try {
                console.log("   [Test 1] Fetching WITHOUT sort...");
                const guestRecords = await guestPb.collection('services').getList(1, 1);
                console.log(`   ✅ [Test 1] Success. Found ${guestRecords.totalItems} items.`);
            } catch (e: any) {
                console.log(`   ❌ [Test 1] FAILED: ${e.status} - ${e.message}`);
            }

            // Test 2: With Sort
            try {
                console.log("   [Test 2] Fetching WITH sort='created'...");
                const guestRecords = await guestPb.collection('services').getList(1, 1, { sort: 'created' });
                console.log(`   ✅ [Test 2] Success. Found ${guestRecords.totalItems} items.`);
            } catch (e: any) {
                console.log(`   ❌ [Test 2] FAILED: ${e.status} - ${e.message}`);
            }

        } catch (e: any) {
            console.log(`\n❌ Failed to inspect [services]: ${e.message}`);
        }

    } catch (e) {
        console.error("❌ Fatal Error:", e);
    }
}

main();
