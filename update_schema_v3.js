
const PB_PATH = './tongxinyuan-community/apps/web/node_modules/pocketbase/dist/pocketbase.cjs.js';
const PocketBase = require(PB_PATH);

const PB_URL = 'http://127.0.0.1:8091';
const ADMIN_EMAIL = 'root@debug.com';
const ADMIN_PASS = 'Tongxinyuan2026!';

const pb = new PocketBase(PB_URL);

async function main() {
    await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASS);

    const col = await pb.collections.getOne('beneficiaries');
    col.schema = col.schema || [];

    // Add guardian_relation
    const fieldsToAdd = [
        { name: 'guardian_relation', type: 'text' }
    ];

    let changed = false;
    for (const f of fieldsToAdd) {
        if (!col.schema.find(existing => existing.name === f.name)) {
            col.schema.push(f);
            changed = true;
            console.log(`Adding field: ${f.name}`);
        }
    }

    if (changed) {
        await pb.collections.update(col.id, col);
        console.log("✅ Updated beneficiaries schema with guardian_relation");
    } else {
        console.log("No missing fields found");
    }
}

main().catch(console.error);
