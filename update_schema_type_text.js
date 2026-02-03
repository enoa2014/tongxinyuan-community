
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
        const fields = col.fields || col.schema;

        if (!fields.find(f => f.name === 'type')) {
            fields.push({
                name: 'type',
                type: 'text', // Fallback to text to avoid validation issues
                required: false,
                presentable: false,
                unique: false,
                options: {}
            });

            await pb.collections.update(col.id, col);
            console.log("✅ Updated beneficiaries schema with type (text)");
        } else {
            console.log("Field 'type' already exists.");
        }

    } catch (e) {
        console.error("Update Failed:", JSON.stringify(e?.response || e, null, 2));
    }
}

main().catch(console.error);
