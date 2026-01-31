
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');
const ADMIN_EMAIL = '86152@tongxy.xyz';
const ADMIN_PASS = '1234567890';

async function main() {
    try {
        await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASS);

        console.log("Creating empty staff auth collection...");
        try {
            const collection = await pb.collections.create({
                name: 'staff',
                type: 'auth',
            });
            console.log("Empty staff created. ID:", collection.id);

            console.log("Adding fields...");

            // Add Role
            collection.fields.push({
                name: 'role',
                type: 'select',
                required: true,
                options: { values: ['social_worker', 'web_admin', 'manager'] }
            });

            // Add Name
            collection.fields.push({
                name: 'name',
                type: 'text',
                required: true,
            });

            await pb.collections.update(collection.id, collection);
            console.log("Fields added successfully.");

        } catch (err: any) {
            console.error("FULL ERROR:", JSON.stringify(err.data, null, 2));
        }

    } catch (e) {
        console.error(e);
    }
}
main();
