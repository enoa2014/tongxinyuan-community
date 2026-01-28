
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');
const ADMIN_EMAIL = '86152@tongxy.xyz';
const ADMIN_PASS = '1234567890';

async function main() {
    console.log("🛠️ Starting Schema Fix (v0.23+ Fields API)...");

    try {
        await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASS);
        console.log("✅ Admin Auth Successful.");

        // Collections to fix
        const collections = ['volunteer_applications', 'service_consultations', 'articles'];

        for (const name of collections) {
            try {
                const col = await pb.collections.getOne(name);
                console.log(`Deleting broken collection: ${name}...`);
                await pb.collections.delete(col.id);
            } catch {
                console.log(`Collection ${name} does not exist (good).`);
            }
        }

        // Recreate with 'fields' property
        console.log("✨ Recreating Collections with correct schema...");

        // 1. Volunteer Applications
        try {
            await pb.collections.create({
                name: 'volunteer_applications',
                type: 'base',
                fields: [
                    { name: 'name', type: 'text', required: true },
                    { name: 'phone', type: 'text', required: true },
                    { name: 'email', type: 'email' },
                    { name: 'age', type: 'number' },
                    { name: 'skills', type: 'json', maxSize: 2000000 },
                    { name: 'motivation', type: 'text' },
                    { name: 'status', type: 'select', values: ['pending', 'approved', 'rejected'], maxSelect: 1 }
                ],
                // Security Rules
                createRule: "",
                listRule: "@request.auth.isAdmin = true",
                viewRule: "@request.auth.isAdmin = true",
                updateRule: "@request.auth.isAdmin = true",
                deleteRule: "@request.auth.isAdmin = true"
            });
            console.log("✅ Created: volunteer_applications");
        } catch (e) {
            console.error("Failed to create volunteer_applications:", e);
        }

        // 2. Service Consultations
        try {
            await pb.collections.create({
                name: 'service_consultations',
                type: 'base',
                fields: [
                    { name: 'name', type: 'text', required: true },
                    { name: 'phone', type: 'text', required: true },
                    { name: 'service_type', type: 'text' },
                    { name: 'description', type: 'text' },
                    { name: 'status', type: 'select', values: ['pending', 'contacted', 'resolved'], maxSelect: 1 }
                ],
                createRule: "",
                listRule: "@request.auth.isAdmin = true",
                viewRule: "@request.auth.isAdmin = true",
                updateRule: "@request.auth.isAdmin = true",
                deleteRule: "@request.auth.isAdmin = true"
            });
            console.log("✅ Created: service_consultations");
        } catch (e) {
            console.error("Failed to create service_consultations:", e);
        }

        // 3. Articles
        try {
            await pb.collections.create({
                name: 'articles',
                type: 'base',
                fields: [
                    { name: 'title', type: 'text', required: true },
                    { name: 'category', type: 'select', values: ['news', 'media', 'policy'], maxSelect: 1 },
                    { name: 'description', type: 'text' },
                    { name: 'content', type: 'editor' },
                    { name: 'cover_image', type: 'file', maxSelect: 1, maxSize: 5242880 }
                ],
                listRule: "",
                viewRule: "",
                createRule: "@request.auth.isAdmin = true",
                updateRule: "@request.auth.isAdmin = true",
                deleteRule: "@request.auth.isAdmin = true"
            });
            console.log("✅ Created: articles");
        } catch (e) {
            console.error("Failed to create articles:", e);
        }

    } catch (e: any) {
        console.error("❌ Schema Fix Failed:", e);
        if (e.response && e.response.data) {
            console.error("Detailed Error:", JSON.stringify(e.response.data, null, 2));
        }
    }
}

main();
