
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

const ADMIN_EMAIL = '86152@tongxy.xyz';
const ADMIN_PASS = '1234567890';

async function main() {
    try {
        console.log("Authenticating as super-admin...");
        await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASS);

        console.log("Fetching 'activities' collection...");
        const collection = await pb.collections.getOne('activities');

        // Find the 'category' field
        // v0.23+ uses 'fields', older uses 'schema'
        const fields = collection.fields || collection.schema || [];
        const categoryField = fields.find((f: any) => f.name === 'category');

        if (categoryField && categoryField.options) {
            const values = categoryField.options.values || [];
            if (!values.includes('other')) {
                console.log("Adding 'other' to category options...");
                values.push('other');
                categoryField.options.values = values;

                await pb.collections.update('activities', {
                    fields: fields // v0.23+ uses fields
                });
                console.log("Schema updated.");
            } else {
                console.log("'other' already exists.");
            }
        } else {
            console.error("Category field not found or has no options.");
        }

    } catch (e) {
        console.error("Error:", e);
    }
}

main();
