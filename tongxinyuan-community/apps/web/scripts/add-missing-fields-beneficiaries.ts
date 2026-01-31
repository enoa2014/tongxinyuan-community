
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');
const ADMIN_EMAIL = '86152@tongxy.xyz';
const ADMIN_PASS = '1234567890';

async function main() {
    try {
        await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASS);

        console.log("Fetching beneficiaries...");
        const col = await pb.collections.getOne('beneficiaries');

        console.log("Adding missing fields (status, category)...");

        // Remove if exists to be safe
        col.fields = col.fields.filter((f: any) => !['status', 'category'].includes(f.name));

        // Add Category
        col.fields.push({
            name: 'category',
            type: 'select',
            options: { values: ['cancer', 'leukemia', 'congenital_heart', 'nephrosis', 'other'], maxSelect: 1 }
        });

        // Add Status
        col.fields.push({
            name: 'status',
            type: 'select',
            options: { values: ['active', 'archived', 'deceased'], maxSelect: 1 }
        });

        await pb.collections.update(col.id, col);
        console.log("Fields added successfully.");

    } catch (e: any) {
        console.error("Error:", JSON.stringify(e.data || e, null, 2));
    }
}
main();
