
const PB_PATH = './tongxinyuan-community/apps/web/node_modules/pocketbase/dist/pocketbase.cjs.js';
const PocketBase = require(PB_PATH);

const PB_URL = 'http://127.0.0.1:8091';
const ADMIN_EMAIL = 'root@debug.com';
const ADMIN_PASS = 'Tongxinyuan2026!';

const pb = new PocketBase(PB_URL);

async function main() {
    await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASS);

    const col = await pb.collections.getOne('family_members');

    // Normalize: use 'fields' if present, otherwise 'schema' (legacy)
    const fieldProp = col.fields ? 'fields' : 'schema';
    console.log(`Using property: ${fieldProp} (Length: ${col[fieldProp]?.length})`);

    const fieldsToAdd = [
        { name: 'is_caregiver', type: 'bool' },
        { name: 'income_contribution', type: 'bool' },
        { name: 'notes', type: 'text' }
    ];

    let changed = false;
    for (const f of fieldsToAdd) {
        if (!col[fieldProp].find(existing => existing.name === f.name)) {
            col[fieldProp].push(f);
            changed = true;
            console.log(`Adding field: ${f.name}`);
        }
    }

    if (changed) {
        try {
            await pb.collections.update(col.id, col);
            console.log("✅ Updated family_members schema");
        } catch (e) {
            console.log("Update Failed:", JSON.stringify(e.response, null, 2));
        }
    } else {
        console.log("No missing fields found");
    }
}

main().catch(console.error);
