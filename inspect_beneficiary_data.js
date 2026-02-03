
const PB_PATH = './tongxinyuan-community/apps/web/node_modules/pocketbase/dist/pocketbase.cjs.js';
const PocketBase = require(PB_PATH);

const PB_URL = 'http://127.0.0.1:8091';
const ADMIN_EMAIL = 'root@debug.com';
const ADMIN_PASS = 'Tongxinyuan2026!';

const pb = new PocketBase(PB_URL);

async function main() {
    await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASS);
    const records = await pb.collection('beneficiaries').getList(1, 1);
    if (records.items.length > 0) {
        console.log("Record Keys:", Object.keys(records.items[0]));
        console.log("Sample Record:", JSON.stringify(records.items[0], null, 2));
    } else {
        console.log("No records found.");
    }
}

main().catch(console.error);
