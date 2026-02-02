
const PB_PATH = './tongxinyuan-community/apps/web/node_modules/pocketbase/dist/pocketbase.cjs.js';
const PocketBase = require(PB_PATH);

const PB_URL = 'http://127.0.0.1:8091';
const ADMIN_EMAIL = 'root@debug.com';
const ADMIN_PASS = 'Tongxinyuan2026!';

const pb = new PocketBase(PB_URL);

async function main() {
    await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASS);

    const col = await pb.collections.getOne('beneficiaries');

    // Add new fields if not present
    col.schema = col.schema || [];
    const newFields = [
        { name: 'address', type: 'text' },
        { name: 'diagnosis', type: 'text' },
        { name: 'background_note', type: 'editor' } // Rich text for compatibility or just text
    ];

    let changed = false;
    for (const f of newFields) {
        if (!col.schema.find(existing => existing.name === f.name)) {
            col.schema.push(f);
            changed = true;
            console.log(`Adding field: ${f.name}`);
        }
    }

    if (changed) {
        await pb.collections.update(col.id, col);
        console.log("✅ Updated beneficiaries schema");
    } else {
        console.log("No changes needed for beneficiaries schema");
    }
}

main().catch(console.error);
