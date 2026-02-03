
const PB_PATH = './tongxinyuan-community/apps/web/node_modules/pocketbase/dist/pocketbase.cjs.js';
const PocketBase = require(PB_PATH);

const PB_URL = 'http://127.0.0.1:8091';
const ADMIN_EMAIL = 'root@debug.com';
const ADMIN_PASS = 'Tongxinyuan2026!';

const pb = new PocketBase(PB_URL);

async function main() {
    await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASS);

    const ben = await pb.collection('beneficiaries').getFirstListItem('name ~ "[Test]"');
    console.log(`Updating beneficiary: ${ben.id} (${ben.name})`);

    const payload = {
        gender: 'M',
        native_place: 'Debug Hometown',
        address: 'Debug Address',
        guardian_name: 'Debug Guardian',
        diagnosis: 'Debug Diagnosis'
    };

    try {
        const updated = await pb.collection('beneficiaries').update(ben.id, payload);
        console.log("Update success!");
        console.log("Updated record:", JSON.stringify(updated, null, 2));
    } catch (e) {
        console.error("Update failed:", e);
    }
}

main().catch(console.error);
