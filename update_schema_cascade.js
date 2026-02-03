
const PB_PATH = './tongxinyuan-community/apps/web/node_modules/pocketbase/dist/pocketbase.cjs.js';
const PocketBase = require(PB_PATH);

const PB_URL = 'http://127.0.0.1:8091';
const ADMIN_EMAIL = 'root@debug.com';
const ADMIN_PASS = 'Tongxinyuan2026!';

const pb = new PocketBase(PB_URL);

const CHILD_COLLECTIONS = [
    'family_members',
    'medical_logs',
    'accommodation_records',
    'beneficiary_media',
    'beneficiary_documents',
    'activity_participations'
];

async function main() {
    await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASS);

    for (const colName of CHILD_COLLECTIONS) {
        try {
            const col = await pb.collections.getOne(colName);
            const fields = col.fields || col.schema; // Handle both PB versions if needed

            let changed = false;

            // Find the 'beneficiary' relation field
            // Note: In newer PBJS, schema is array of fields. 
            // We need to look for 'relation' type pointing to 'beneficiaries'

            for (const field of fields) {
                if (field.type === 'relation' && field.name === 'beneficiary') {
                    if (!field.options) field.options = {};

                    if (field.options.cascadeDelete !== true) {
                        field.options.cascadeDelete = true;
                        changed = true;
                        console.log(`[${colName}] Enable cascadeDelete for field 'beneficiary'`);
                    }
                }
            }

            if (changed) {
                await pb.collections.update(col.id, col);
                console.log(`✅ Updated ${colName}`);
            } else {
                console.log(`[${colName}] Already configured or field not found.`);
            }

        } catch (e) {
            // Ignore 404 if collection doesn't exist, but log others
            if (e.status !== 404) {
                console.error(`❌ Failed to update ${colName}:`, e.message);
            } else {
                console.log(`[${colName}] Collection not found, skipping.`);
            }
        }
    }
}

main().catch(console.error);
