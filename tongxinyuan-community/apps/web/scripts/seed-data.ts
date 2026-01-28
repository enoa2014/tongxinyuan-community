
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');
const ADMIN_EMAIL = '86152@tongxy.xyz';
const ADMIN_PASS = '1234567890';

async function main() {
    console.log("🌱 Seeding Persistent Data...");

    try {
        await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASS);
        console.log("✅ Admin Auth Successful");
    } catch (e) {
        console.error("❌ Admin Auth Failed:", e);
        return;
    }

    try {
        // Volunteer
        const v = await pb.collection('volunteer_applications').create({
            name: "Persistent Volunteer",
            phone: "13800008888",
            status: "pending",
            skills: { level: "expert", test: false },
            email: "volunteer@example.com",
            age: 25,
            motivation: "I love helping people!"
        });
        console.log(`✅ Seeded Volunteer: ${v.id} (${v.name})`);

        // Consultation
        const c = await pb.collection('service_consultations').create({
            name: "Persistent Family",
            phone: "13900009999",
            service_type: "Medical",
            description: "Need help with surgery costs.",
            status: "pending"
        });
        console.log(`✅ Seeded Consultation: ${c.id} (${c.name})`);

    } catch (e: any) {
        console.error("❌ Seeding Failed:", e.message);
    }
}

main();
