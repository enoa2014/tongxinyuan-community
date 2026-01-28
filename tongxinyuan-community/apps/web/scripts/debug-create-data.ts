
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');
const ADMIN_EMAIL = '86152@tongxy.xyz';
const ADMIN_PASS = '1234567890';

async function main() {
    console.log("🛠️ Starting Direct Write Test...");

    try {
        // 1. Auth
        console.log("🔑 Authenticating...");
        await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASS);
        console.log("✅ Auth Successful.");

        // 2. Create Data
        const payload = {
            name: "DirectTest User",
            phone: "13988889999",
            status: "pending",
            motivation: "Created via debug-create-data.ts",
            skills: { level: "level3", from: "script" }
        };

        console.log("📤 Sending Payload:", JSON.stringify(payload, null, 2));
        const record = await pb.collection('volunteer_applications').create(payload);
        console.log(`✅ Record Created ID: ${record.id}`);

        // 3. Read Back
        console.log("📥 Reading Back...");
        const fetched = await pb.collection('volunteer_applications').getOne(record.id);
        console.log("Raw Fetched Object:", JSON.stringify(fetched, null, 2));

        if (fetched.name === "DirectTest User") {
            console.log("🎉 SUCCESS: Data persisted correctly!");
        } else {
            console.log("⚠️ FAILURE: Data is missing or mismatched.");
        }

    } catch (e) {
        console.error("❌ Write Failed:", e);
    }
}

main();
