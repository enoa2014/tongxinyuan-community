
const PB_PATH = './tongxinyuan-community/apps/web/node_modules/pocketbase/dist/pocketbase.cjs.js';
const PocketBase = require(PB_PATH);

const PB_URL = 'http://127.0.0.1:8091';
const ADMIN_EMAIL = 'root@debug.com';
const ADMIN_PASS = 'Tongxinyuan2026!';

const pb = new PocketBase(PB_URL);

async function main() {
    await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASS);

    const col = await pb.collections.getOne('family_members');
    console.log(JSON.stringify(col, null, 2));

    // Also check medical_logs for comparison
    const colMed = await pb.collections.getOne('medical_logs');
    console.log("Medical Logs Schema for comparison:", JSON.stringify(colMed, null, 2));
}

main().catch(console.error);
