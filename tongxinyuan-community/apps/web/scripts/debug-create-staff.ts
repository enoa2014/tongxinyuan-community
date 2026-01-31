
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');
const ADMIN_EMAIL = '86152@tongxy.xyz';
const ADMIN_PASS = '1234567890';

async function main() {
    try {
        await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASS);

        console.log("Creating staff...");

        const schema = [
            { name: 'name', type: 'text', required: true },
            { name: 'avatar', type: 'file' },
            { name: 'role', type: 'select', required: true, options: { values: ['social_worker', 'web_admin', 'manager'] } }
        ];

        try {
            await pb.collections.create({
                name: 'staff',
                type: 'auth', // IMPORTANT: Staff handles login, so it SHOULD be 'auth' type?
                // Wait, 'base' with auth fields? No.
                // If I want to use authWithPassword, it MUST be 'auth' type.
                // In init-schema.ts I used 'base'. That might be the problem if I included authRule?
                // But base collection doesn't support authRule?
                // AND base collection doesn't work with authWithPassword.
                // SO STAFF MUST BE AUTH COLLECTION.
                type: 'auth',
                fields: schema,
                listRule: "id = @request.auth.id",
                viewRule: "id = @request.auth.id",
                createRule: "",
                updateRule: "id = @request.auth.id",
                deleteRule: "",
                authRule: "",
            });
            console.log("Success!");
        } catch (err: any) {
            console.error("FULL ERROR:", JSON.stringify(err.data, null, 2));
        }

    } catch (e) {
        console.error("Auth Error:", e);
    }
}

main();
