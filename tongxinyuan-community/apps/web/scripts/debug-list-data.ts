
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');
const ADMIN_EMAIL = '86152@tongxy.xyz';
const ADMIN_PASS = '1234567890';

async function main() {
    console.log("🔍 Inspecting Database Records...");

    try {
        console.log("🔑 Authenticating...");
        await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASS);
        console.log("✅ Auth Successful.");

        console.log("📡 Testing: List Users...");
        const users = await pb.collection('users').getList(1, 1);
        console.log(`✅ Users count: ${users.totalItems}`);

        console.log("📡 Testing: List Volunteers (No Sort)...");
        const result = await pb.collection('volunteer_applications').getList(1, 50);
        const volunteers = result.items;
        console.log(`\n📋 Volunteer Applications (${result.totalItems}):`);
        volunteers.forEach(v => {
            console.log(`\n--- Record: ${v.id} ---`);
            console.log("Raw Object:", JSON.stringify(v, null, 2));
        });

        if (volunteers.length === 0) {
            console.log("   (No records found)");
        }

    } catch (e) {
        console.error("❌ Error fetching data:", e);
    }
}

main();
