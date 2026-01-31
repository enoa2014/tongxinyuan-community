
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');
const ADMIN_EMAIL = '86152@tongxy.xyz';
const ADMIN_PASS = '1234567890';

async function main() {
    try {
        await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASS);

        console.log("Fetching beneficiaries...");
        const col = await pb.collections.getOne('beneficiaries');

        // Remove existing phone if present (to overwrite definition)
        col.fields = col.fields.filter((f: any) => f.name !== 'phone');

        // Add Phone
        console.log("Adding phone field...");
        col.fields.push({
            name: 'phone',
            type: 'text',
            required: true
        });

        await pb.collections.update(col.id, col);
        console.log("Phone field added.");

        // Add Index
        if (!col.indexes.some((i: string) => i.includes('idx_phone'))) {
            col.indexes.push("CREATE UNIQUE INDEX `idx_phone` ON `beneficiaries` (`phone`)");
            await pb.collections.update(col.id, col);
            console.log("Unique Index added.");
        }

    } catch (e: any) {
        console.error("Error:", JSON.stringify(e.data || e, null, 2));
    }
}
main();
