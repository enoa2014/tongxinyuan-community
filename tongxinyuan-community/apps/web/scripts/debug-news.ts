
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');
const ADMIN_EMAIL = '86152@tongxy.xyz';
const ADMIN_PASS = '1234567890';

async function main() {
    console.log("🕵️ Debugging 'news' collection...");

    // 1. Login
    try {
        await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASS);
        console.log("✅ Admin Logged In");
    } catch (e) {
        console.error("❌ Admin Login Failed:", e);
        return;
    }

    // 2. Fetch Collection Info
    try {
        const collection = await pb.collections.getOne('news');
        console.log("📂 Collection Schema:", JSON.stringify(collection.schema, null, 2));
        console.log("   System:", collection.system);
        console.log("   Type:", collection.type);
    } catch (e) {
        console.error("❌ Failed to get collection info:", e);
    }

    // 3. Try to List with Sort
    console.log("\n🔄 Testing getList(sort: '-created')...");
    try {
        const result = await pb.collection('news').getList(1, 5, {
            sort: '-created',
        });
        console.log(`✅ Success! Found ${result.totalItems} items.`);
        if (result.items.length > 0) {
            console.log("   Sample item created:", result.items[0].created);
        }
    } catch (e: any) {
        console.error("❌ getList Failed!");
        console.error("   Status:", e.status);
        console.error("   Message:", e.message);
        console.error("   Data:", JSON.stringify(e.data, null, 2));
    }
}

main();
