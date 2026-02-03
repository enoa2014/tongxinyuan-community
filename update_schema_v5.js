
const PB_PATH = './tongxinyuan-community/apps/web/node_modules/pocketbase/dist/pocketbase.cjs.js';
const PocketBase = require(PB_PATH);

const PB_URL = 'http://127.0.0.1:8091';
const ADMIN_EMAIL = 'root@debug.com';
const ADMIN_PASS = 'Tongxinyuan2026!';

const pb = new PocketBase(PB_URL);

async function main() {
    await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASS);

    const col = await pb.collections.getOne('beneficiaries');

    // Normalize: use 'fields' if present, otherwise 'schema' (legacy)
    const fieldProp = col.fields ? 'fields' : 'schema';
    console.log(`Using property: ${fieldProp} (Length: ${col[fieldProp]?.length})`);

    // Define all needed fields with PROPER structure for new PB versions (flattened)
    const fieldsToAdd = [
        { name: 'address', type: 'text' },
        { name: 'diagnosis', type: 'text' },
        { name: 'background_note', type: 'editor' },
        // Select fields: values are top-level
        { name: 'gender', type: 'select', values: ['M', 'F'], maxSelect: 1 },
        { name: 'birth_date', type: 'date' },
        { name: 'native_place', type: 'text' },
        { name: 'guardian_name', type: 'text' },
        { name: 'guardian_phone', type: 'text' },
        { name: 'guardian_relation', type: 'text' },
        { name: 'hospital', type: 'text' },
        { name: 'treatment_stage', type: 'select', values: ['initial', 'chemo', 'transplant', 'rehab', 'palliative'], maxSelect: 1 }
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
            console.log("✅ Updated beneficiaries schema with ALL enhanced fields (Correct Structure)");
        } catch (e) {
            console.error("Update failed:", JSON.stringify(e.response, null, 2));
        }
    } else {
        console.log("No missing fields found (all present)");
    }
}

main().catch(console.error);
