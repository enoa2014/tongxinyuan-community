
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');
const ADMIN_EMAIL = '86152@tongxy.xyz';
const ADMIN_PASS = '1234567890';

async function main() {
    console.log("🛠️ Inspecting Schema Definition...");

    try {
        await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASS);

        const collection = await pb.collections.getOne('users');
        console.log("Schema Definition:", JSON.stringify(collection, null, 2));

    } catch (e) {
        console.error("❌ Inspection Failed:", e);
    }
}

main();
