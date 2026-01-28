
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');
const ADMIN_EMAIL = '86152@tongxy.xyz';
const ADMIN_PASS = '1234567890';

async function main() {
    console.log("🚀 Starting Backend Verification...");

    // 1. Authenticate (Need admin to VIEW/DELETE, though create is public)
    try {
        await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASS);
        console.log("✅ Admin Auth Successful");
    } catch (e) {
        console.error("❌ Admin Auth Failed:", e);
        return;
    }

    // 2. Verify Volunteer Applications
    try {
        console.log("Testing 'volunteer_applications'...");
        const record = await pb.collection('volunteer_applications').create({
            name: "Test Volunteer",
            phone: "13800138000",
            status: "pending",
            skills: { level: "level1", test: true }
        });
        console.log(`- Created record: ${record.id}`);

        const fetchRecord = await pb.collection('volunteer_applications').getOne(record.id);
        if (fetchRecord.name === "Test Volunteer") {
            console.log("✅ Verified: Create & Read success");
        }

        await pb.collection('volunteer_applications').delete(record.id);
        console.log("✅ Verified: Delete success");
    } catch (e) {
        console.error("❌ Volunteer Verification Failed:", e);
    }

    // 3. Verify Service Consultations
    try {
        console.log("Testing 'service_consultations'...");
        const record = await pb.collection('service_consultations').create({
            name: "Test Family",
            phone: "13900139000",
            service_type: "Accommodation",
            description: "Need help",
            status: "pending"
        });
        console.log(`- Created record: ${record.id}`);

        const fetchRecord = await pb.collection('service_consultations').getOne(record.id);
        if (fetchRecord.name === "Test Family") {
            console.log("✅ Verified: Create & Read success");
        }

        await pb.collection('service_consultations').delete(record.id);
        console.log("✅ Verified: Delete success");
    } catch (e) {
        console.error("❌ Service Verification Failed:", e);
    }

    console.log("🎉 Backend Verification Complete!");
}

main();
