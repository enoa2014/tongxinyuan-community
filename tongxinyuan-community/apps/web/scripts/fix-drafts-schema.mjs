import PocketBase from 'pocketbase';

const PB_URL = 'http://127.0.0.1:8090';
const ADMIN_EMAIL = 'root@debug.com';
const ADMIN_PASS = 'Tongxinyuan2026!';

const pb = new PocketBase(PB_URL);

async function main() {
    try {
        console.log('Authenticating...');
        await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASS);

        const collection = await pb.collections.getOne('drafts');
        console.log('Current fields:', JSON.stringify(collection.fields, null, 2));

        // Re-define fields explicitly
        // We carefully preserve existing field IDs if possible via UI, but via API we just send the array.
        // PB tries to match by name usually.

        // Wait, standard practice for PB JS SDK update is to send the partial data.
        // But for fields, we must send ALL fields if we want to keep them.

        // Let's verify if 'status' is configured correctly.
        // It should be presentable: false (default), but searchable.

        // IMPORTANT: In recent PB versions, Select fields might need specific options.

        const staffCol = await pb.collections.getOne('staff');

        const newFields = [
            { name: "type", type: "select", maxSelect: 1, values: ["text", "audio", "photo"], required: false },
            { name: "content", type: "text", required: false },
            { name: "file", type: "file", maxSelect: 1, maxSize: 5242880, required: false },
            { name: "staff", type: "relation", collectionId: staffCol.id, maxSelect: 1, required: true },
            { name: "status", type: "select", maxSelect: 1, values: ["pending", "processed"], required: false }
        ];

        // We'll update the collection
        await pb.collections.update('drafts', {
            fields: newFields
        });

        console.log('✅ Updated "drafts" schema.');

        // Double check
        const updated = await pb.collections.getOne('drafts');
        console.log('New fields:', JSON.stringify(updated.fields, null, 2));

    } catch (e) {
        console.error('Failed', e);
    }
}

main();
