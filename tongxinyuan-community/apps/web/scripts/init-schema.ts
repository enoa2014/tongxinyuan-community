
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

// Configuration
const ADMIN_EMAIL = '86152@tongxy.xyz';
const ADMIN_PASS = '1234567890';

async function main() {
    try {
        console.log("Authenticating as admin...");
        await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASS);
        console.log("Logged in as admin.");

        // 1. Volunteer Applications Collection
        await createCollection('volunteer_applications', [
            { name: 'name', type: 'text', required: true },
            { name: 'phone', type: 'text', required: true },
            { name: 'email', type: 'email' },
            { name: 'age', type: 'number' },
            { name: 'skills', type: 'json' }, // Store selected skills
            { name: 'motivation', type: 'text' },
            { name: 'status', type: 'select', options: { values: ['pending', 'approved', 'rejected'] } }
        ], {
            createRule: "",      // Public create
            listRule: "@request.auth.isAdmin = true",
            viewRule: "@request.auth.isAdmin = true",
            updateRule: "@request.auth.isAdmin = true",
            deleteRule: "@request.auth.isAdmin = true"
        });

        // 2. Service Consultations Collection
        await createCollection('service_consultations', [
            { name: 'name', type: 'text', required: true },
            { name: 'phone', type: 'text', required: true },
            { name: 'service_type', type: 'text' }, // Accommodation, Policy, etc.
            { name: 'description', type: 'text' },
            { name: 'status', type: 'select', options: { values: ['pending', 'contacted', 'resolved'] } }
        ], {
            createRule: "",      // Public create
            listRule: "@request.auth.isAdmin = true",
            viewRule: "@request.auth.isAdmin = true",
            updateRule: "@request.auth.isAdmin = true",
            deleteRule: "@request.auth.isAdmin = true"
        });

        // 3. Articles (News) Collection
        await createCollection('articles', [
            { name: 'title', type: 'text', required: true },
            { name: 'category', type: 'select', options: { values: ['news', 'media', 'policy'] } },
            { name: 'description', type: 'text' },
            { name: 'content', type: 'editor' }, // HTML content
            { name: 'cover_image', type: 'file' }
        ], {
            listRule: "", // Public list
            viewRule: "", // Public view
            createRule: "@request.auth.isAdmin = true", // Admin only
            updateRule: "@request.auth.isAdmin = true",
            deleteRule: "@request.auth.isAdmin = true"
        });

        // 4. Site Settings Collection (Singleton-like)
        await createCollection('site_settings', [
            { name: 'site_name', type: 'text', required: true },
            { name: 'description', type: 'text' },
            { name: 'contact_phone', type: 'text' },
            { name: 'contact_email', type: 'text' },
            { name: 'announcement', type: 'text' }
        ], {
            listRule: "", // Public legible (for footer/header)
            viewRule: "", // Public legible
            createRule: "@request.auth.isAdmin = true",
            updateRule: "@request.auth.isAdmin = true",
            deleteRule: "@request.auth.isAdmin = true"
        });

        // 5. Staff Collection (RBAC)
        // 5. Staff Collection (RBAC) - Manual robust creation
        try {
            await pb.collections.getOne('staff');
            console.log("Collection 'staff' already exists. Skipping.");
        } catch {
            console.log("Creating collection 'staff' (Auth)...");
            try {
                // 1. Create empty auth collection
                const col = await pb.collections.create({
                    name: 'staff',
                    type: 'auth',
                    listRule: "id = @request.auth.id",
                    viewRule: "id = @request.auth.id",
                    createRule: "",
                    updateRule: "id = @request.auth.id",
                    deleteRule: "",
                    authRule: "",
                });

                // 2. Add custom fields
                // Custom fields: Name, Avatar, Role
                const fieldsToAdd = [
                    { name: 'name', type: 'text' },
                    { name: 'avatar', type: 'file', options: { maxSelect: 1 } },
                    { name: 'role', type: 'select', required: true, options: { values: ['social_worker', 'web_admin', 'manager'] } }
                ];

                // Append to existing fields (which include system fields)
                // We use Array.prototype.push.apply to append all
                // But col.fields is an array.
                for (const f of fieldsToAdd) {
                    col.fields.push(f);
                }

                await pb.collections.update(col.id, col);
                console.log("Collection 'staff' created and fields updated.");

            } catch (err) {
                console.error("Failed to create 'staff':", err);
            }
        }

    } catch (e) {
        console.error("Error:", e);
    }
}

async function createCollection(name: string, fields: any[], rules: any) {
    try {
        await pb.collections.getOne(name);
        console.log(`Collection '${name}' already exists. Skipping.`);
    } catch {
        console.log(`Creating collection '${name}'...`);
        try {
            await pb.collections.create({
                name,
                type: name === 'staff' ? 'auth' : 'base', // FIXED: Staff must be auth collection
                fields,
                ...rules
            });
            console.log(`Collection '${name}' created.`);
        } catch (err) {
            console.error(`Failed to create '${name}':`, err);
        }
    }
}

main();
