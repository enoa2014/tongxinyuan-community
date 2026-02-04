import PocketBase from 'pocketbase';

const PB_URL = 'http://127.0.0.1:8090'; // Use the port we verified
const ADMIN_EMAIL = 'root@debug.com';
const ADMIN_PASSWORD = 'Tongxinyuan2026!';

async function main() {
    const pb = new PocketBase(PB_URL);

    try {
        console.log('Authenticating as admin...');
        await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);

        const collection = await pb.collections.getOne('drafts');
        console.log('Current rules:', { list: collection.listRule });

        console.log('Updating rules to be more permissive...');
        await pb.collections.update(collection.id, {
            // Allow any authenticated user to list/view/create for now
            listRule: "@request.auth.id != ''",
            viewRule: "@request.auth.id != ''",
            createRule: "@request.auth.id != ''",
            updateRule: "@request.auth.id != ''",
            deleteRule: "@request.auth.id != ''",
        });

        console.log('Rules updated successfully.');

    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

main();
