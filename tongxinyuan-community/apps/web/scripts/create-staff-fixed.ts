
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');
const ADMIN_EMAIL = '86152@tongxy.xyz';
const ADMIN_PASS = '1234567890';

async function main() {
    try {
        await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASS);

        // Delete staff if exists
        try { await pb.collections.delete('staff'); } catch { }

        // Fetch users to get system fields
        const users = await pb.collections.getOne('users');

        // Filter out Users' custom fields if any (name/avatar usually custom in Users too but built-in-ish)
        // We keep system fields.
        // System fields: id, password, tokenKey, email, emailVisibility, verified, created, updated
        // EXCLUDE 'id' because create() might generate it or dislike it in definition?
        const systemFields = users.fields.filter((f: any) => f.system && f.name !== 'id');

        // Prepare new fields
        const newFields = [...systemFields];

        // Add custom fields
        newFields.push({ name: 'name', type: 'text' });
        newFields.push({
            name: 'avatar',
            type: 'file',
            options: {
                maxSelect: 1,
                maxSize: 5242880,
                mimeTypes: ["image/jpeg", "image/png", "image/svg+xml", "image/gif", "image/webp"]
            }
        });
        newFields.push({
            name: 'role',
            type: 'select',
            required: true,
            options: { maxSelect: 1, values: ['social_worker', 'web_admin', 'manager'] }
        });

        console.log("Creating staff with cloned system fields...");
        await pb.collections.create({
            name: 'staff',
            type: 'auth',
            fields: newFields,
            listRule: "id = @request.auth.id",
            viewRule: "id = @request.auth.id",
            createRule: null, // Admin only
            updateRule: "id = @request.auth.id",
            deleteRule: null,
            authRule: "", // Public auth allowed? Or restricted? "" means public.
        });

        console.log("Success!");

    } catch (e: any) {
        console.error("Error:", JSON.stringify(e.data || e, null, 2));
    }
}
main();
