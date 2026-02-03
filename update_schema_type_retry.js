
const PB_PATH = './tongxinyuan-community/apps/web/node_modules/pocketbase/dist/pocketbase.cjs.js';
const PocketBase = require(PB_PATH);

const PB_URL = 'http://127.0.0.1:8091';
const ADMIN_EMAIL = 'root@debug.com';
const ADMIN_PASS = 'Tongxinyuan2026!';

const pb = new PocketBase(PB_URL);

async function main() {
    await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASS);

    try {
        const col = await pb.collections.getOne('beneficiaries');
        // Ensure we handle both 'schema' (old PB) and 'fields' (new PB)
        const fields = col.fields || col.schema;

        // Remove existing 'type' field if defective to ensure clean add
        // const existingIdx = fields.findIndex(f => f.name === 'type');
        // if (existingIdx >= 0) {
        //     fields.splice(existingIdx, 1);
        // }

        if (!fields.find(f => f.name === 'type')) {
            fields.push({
                name: 'type',
                type: 'select',
                required: false,
                presentable: false,
                unique: false,
                options: {
                    maxSelect: 1,
                    values: ['illness_child', 'girl_student']
                }
            });

            await pb.collections.update(col.id, col);
            console.log("✅ Updated beneficiaries schema with type");
        } else {
            console.log("Field 'type' already exists.");
        }

    } catch (e) {
        console.error("Update Failed:", JSON.stringify(e?.response || e, null, 2));
    }
}

main().catch(console.error);
