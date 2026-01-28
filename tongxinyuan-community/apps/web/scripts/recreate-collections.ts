
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

    // Define correct configs (WITH system: true)
    const configs = [
        {
            name: "volunteer_applications",
            type: "base",
            system: true,
            fields: [
                { name: "name", type: "text", required: true },
                { name: "phone", type: "text", required: true },
                { name: "age", type: "number" },
                { name: "email", type: "email" },
                // select fields in PB usually need 'maxSelect'
                { name: "status", type: "select", maxSelect: 1, values: ["pending", "approved", "rejected"] },
                { name: "skills", type: "json" },
                { name: "motivation", type: "text" }
            ],
            listRule: "@request.auth.id != ''", // Only authenticated
            viewRule: "@request.auth.id != ''",
            createRule: "", // Public create
            updateRule: "@request.auth.id != ''",
            deleteRule: "@request.auth.id != ''"
        },
        {
            name: "service_consultations",
            type: "base",
            system: true,
            fields: [
                { name: "name", type: "text", required: true },
                { name: "phone", type: "text", required: true },
                { name: "service_type", type: "select", maxSelect: 1, values: ["Medical", "Education", "Accommodation", "Financial"] },
                { name: "description", type: "text" },
                { name: "status", type: "select", maxSelect: 1, values: ["pending", "contacted", "resolved"] }
            ],
            listRule: "@request.auth.id != ''",
            viewRule: "@request.auth.id != ''",
            createRule: "",
            updateRule: "@request.auth.id != ''",
            deleteRule: "@request.auth.id != ''"
        }
    ];

    for (const config of configs) {
        try {
            console.log(`\n🗑 Deleting existing '${config.name}'...`);
            try {
                const existing = await pb.collections.getOne(config.name);
                await pb.collections.delete(existing.id);
                console.log("   ✅ Deleted.");
            } catch (e: any) {
                console.log(`   ⚠️ Delete skipped: ${e.message}`);
                if (e.data) console.error("   Delete Details:", JSON.stringify(e.data, null, 2));
            }

            // Create with original name first, if delete failed this will fail.
            // If we really can't delete, we might need to debug why.
            console.log(`✨ Re-creating '${config.name}' with system fields...`);
            await pb.collections.create(config);
            console.log("   ✅ Created!");

            // Seed one record
            console.log(`🌱 Seeding test record for '${config.name}'...`);
            await pb.collection(config.name).create({
                name: "Test User (Re-created)",
                phone: "13912345678",
                status: "pending"
            });
            console.log("   ✅ Seeded!");

        } catch (e: any) {
            console.error(`❌ Failed to recreate '${config.name}':`, e.message);
            if (e.data) console.error("   Details:", JSON.stringify(e.data, null, 2));
            if (e.response) console.error("   Response:", JSON.stringify(e.response, null, 2));
        }
    }
}

main();
