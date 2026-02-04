import PocketBase from 'pocketbase';

const PB_URL = 'http://127.0.0.1:8090';
// Try using the staff account if admin fails, though normally admin is needed for schema updates.
// If admin fails, we might need to check how to get admin access.
// But earlier scripts used root@debug.com. Maybe the password is different?
// Let's try to list collections with staff info first to see if we can at least read.
// Actually, only admins can update schema.

const ADMIN_EMAIL = 'temp@debug.com';
const ADMIN_PASS = 'TempPass123!';
// Maybe I should try creating an admin via CLI if I can? 
// Or try the other user 'social@worker.com' but they probably lack permission.

// Let's assume the previous failure was ephemeral or I need to use a different method.
// I will try to use the 'social@worker.com' just to see if I can READ the schema first.
// If I can't write, I'll need to use the ./pocketbase admin export mechanism or similar.

async function main() {
    console.log("Attempting schema update...");
    const pb = new PocketBase(PB_URL);

    try {
        await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASS);
    } catch (e) {
        console.error("Admin auth failed. Trying to proceed anyway (might fail)...");
        // Check if we can use the CLI to set admin?
        // Cannot run CLI here easily.
    }

    // Define the correct schema fields
    const newSchema = [
        {
            "name": "type",
            "type": "select",
            "required": true,
            "options": {
                "maxSelect": 1,
                "values": ["audio", "text", "photo"]
            }
        },
        {
            "name": "content",
            "type": "text",
            "required": false
        },
        {
            "name": "file",
            "type": "file",
            "required": false,
            "options": {
                "maxSelect": 1,
                "maxSize": 5242880,
                "mimeTypes": ["image/*", "audio/*"]
            }
        },
        {
            "name": "status",
            "type": "select",
            "required": false,
            "options": {
                "maxSelect": 1,
                "values": ["pending", "processed"]
            }
        },
        // We will skip relation for now to reduce complexity if ID finding fails, 
        // OR we just use a text field for staff ID temporarily if relation is strict?
        // No, let's try to get it right.
        {
            "name": "staff",
            "type": "relation",
            "required": false,
            "options": {
                "collectionId": "", // Will fill below
                "cascadeDelete": false,
                "minSelect": null,
                "maxSelect": 1,
                "displayFields": null
            }
        }
    ];

    try {
        // Find staff collection ID
        let staffColId = "";
        try {
            const staffCol = await pb.collections.getOne('staff');
            staffColId = staffCol.id;
        } catch (e) {
            console.log("Could not find 'staff', trying 'users'");
            const usersCol = await pb.collections.getOne('users');
            staffColId = usersCol.id;
        }

        const staffField = newSchema.find(f => f.name === 'staff');
        if (staffField) staffField.options.collectionId = staffColId;

        console.log("Updating schema with staffColId:", staffColId);

        await pb.collections.update('drafts', {
            schema: newSchema
        });
        console.log("Schema updated successfully!");
    } catch (e) {
        console.error("Update failed:", e.data || e.message);
    }
}

main();
