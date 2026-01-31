
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');
const ADMIN_EMAIL = '86152@tongxy.xyz';
const ADMIN_PASS = '1234567890';

async function main() {
    try {
        console.log("Authenticating...");
        await pb.collection('_superusers').authWithPassword(ADMIN_EMAIL, ADMIN_PASS);

        console.log("Fetching collection 'activities'...");
        const collection = await pb.collections.getOne('activities');
        const staffCollection = await pb.collections.getOne('staff');

        console.log("Current fields:", collection.fields.map(f => f.name));

        // Define new fields
        const newFields = [
            {
                name: 'start_time',
                type: 'date',
                required: false,
                presentable: false,
                system: false,
            },
            {
                name: 'end_time',
                type: 'date',
                required: false,
                presentable: false,
                system: false,
            },
            {
                name: 'location',
                type: 'text',
                required: false,
                presentable: false,
                system: false,
                max: 0,
                min: 0,
                pattern: ""
            },
            {
                name: 'summary',
                type: 'text', // using text for simplicity, could be editor
                required: false,
                presentable: false,
                system: false,
            },
            {
                name: 'lead_staff',
                type: 'relation',
                required: false,
                presentable: false,
                system: false,
                collectionId: staffCollection.id,
                cascadeDelete: false,
                minSelect: null,
                maxSelect: 1,
                displayFields: null
            },
            {
                name: 'status',
                type: 'select',
                required: false,
                presentable: false,
                system: false,
                maxSelect: 1,
                values: ['planned', 'active', 'completed', 'cancelled']
            },
            {
                name: 'category',
                type: 'select',
                required: false,
                presentable: false,
                system: false,
                maxSelect: 1,
                values: ['visit', 'event', 'support', 'other']
            }
        ];

        // Merge fields: Keep existing ones, append new ones if not present
        const currentFieldNames = new Set(collection.fields.map(f => f.name));
        const fieldsToAdd = newFields.filter(f => !currentFieldNames.has(f.name));

        if (fieldsToAdd.length === 0) {
            console.log("No new fields to add.");
            return;
        }

        const updatedFields = [...collection.fields, ...fieldsToAdd];

        console.log("Updating collection with new fields:", fieldsToAdd.map(f => f.name));

        await pb.collections.update(collection.id, {
            fields: updatedFields
        });

        console.log("Schema updated successfully!");

    } catch (e: any) {
        console.error("Error updating schema:", e.data || e);
    }
}

main();
