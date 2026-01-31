
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');
const ADMIN_EMAIL = '86152@tongxy.xyz';
const ADMIN_PASS = '1234567890';

async function main() {
    try {
        await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASS);

        console.log("Fetching beneficiaries...");
        const col = await pb.collections.getOne('beneficiaries');

        console.log("Adding status (text) field...");

        // Remove if exists
        col.fields = col.fields.filter((f: any) => f.name !== 'status');

        // Add Status as TEXT
        col.fields.push({
            name: 'status',
            type: 'text',
            // required: true // Let's not make it required to avoid 'cannot be blank' if there's existing data (though there isn't much)
        });

        await pb.collections.update(col.id, col);
        console.log("Status (text) field added.");

    } catch (e: any) {
        console.error("Error:", JSON.stringify(e.data || e, null, 2));
    }
}
main();
