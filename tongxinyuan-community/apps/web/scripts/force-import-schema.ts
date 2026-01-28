
import PocketBase from 'pocketbase';

async function main() {
    const pb = new PocketBase('http://127.0.0.1:8090');

    console.log("🔑 Authenticating as Admin...");
    await pb.admins.authWithPassword('86152@tongxy.xyz', '1234567890');

    const collections = [
        {
            name: "volunteer_applications",
            type: "base",
            system: true,
            fields: [
                { name: "id", type: "text", required: true, primaryKey: true, autogeneratePattern: "[a-z0-9]{15}" },
                { name: "name", type: "text", required: true },
                { name: "phone", type: "text", required: true },
                { name: "age", type: "number" },
                { name: "email", type: "email" },
                { name: "status", type: "select", maxSelect: 1, values: ["pending", "approved", "rejected"] },
                { name: "skills", type: "json" },
                { name: "motivation", type: "text" },
                { name: "created", type: "autodate", onCreate: true }, // Explicitly define system fields in import?
                { name: "updated", type: "autodate", onCreate: true, onUpdate: true }
            ],
            listRule: "@request.auth.id != ''",
            viewRule: "@request.auth.id != ''",
            createRule: "",
            updateRule: "@request.auth.id != ''",
            deleteRule: "@request.auth.id != ''"
        },
        {
            name: "service_consultations",
            type: "base",
            system: true,
            fields: [
                { name: "id", type: "text", required: true, primaryKey: true, autogeneratePattern: "[a-z0-9]{15}" },
                { name: "name", type: "text", required: true },
                { name: "phone", type: "text", required: true },
                { name: "service_type", type: "select", maxSelect: 1, values: ["Medical", "Education", "Accommodation", "Financial"] },
                { name: "description", type: "text" },
                { name: "status", type: "select", maxSelect: 1, values: ["pending", "contacted", "resolved"] },
                { name: "created", type: "autodate", onCreate: true },
                { name: "updated", type: "autodate", onCreate: true, onUpdate: true }
            ],
            listRule: "@request.auth.id != ''",
            viewRule: "@request.auth.id != ''",
            createRule: "",
            updateRule: "@request.auth.id != ''",
            deleteRule: "@request.auth.id != ''"
        }
    ];

    console.log("✨ Importing Schema (Force Overwrite)...");
    try {
        // 'import' endpoint is usually used for full schema sync.
        // It accepts an array of collections.
        await pb.collections.import(collections, false); // false = deleteMissing? No, check SDK.
        // SDK: import(collections, deleteMissing = false)
        console.log("✅ Import Success!");

        // Seed if needed (import doesn't delete data usually, but let's check)
        // If previous table was empty, we are good.

    } catch (e: any) {
        console.error("❌ Import Failed:", e.message);
        if (e.data) console.error("   Details:", JSON.stringify(e.data, null, 2));
    }
}

main();
