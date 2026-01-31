
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');
const ADMIN_EMAIL = '86152@tongxy.xyz';
const ADMIN_PASS = '1234567890';

async function main() {
    try {
        await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASS);

        console.log("Creating beneficiaries...");

        const schema = [
            { name: 'name', type: 'text', required: true },
            { name: 'phone', type: 'text', required: true },
            {
                name: 'type', type: 'select', required: true, options: {
                    values: ['patient_family', 'teenage_girl', 'sexual_abuse_victim', 'palliative_care', 'public']
                }
            },
            { name: 'status', type: 'select', options: { values: ['active', 'archived', 'blacklisted'] } },
            { name: 'profile', type: 'json' },
            { name: 'tags', type: 'json' },
            { name: 'created_by', type: 'relation', collectionId: 'staff', cascadeDelete: false },
        ];

        try {
            await pb.collections.create({
                name: 'beneficiaries',
                type: 'base',
                fields: schema,
                listRule: "@request.auth.collectionName = 'staff'",
                indexes: ["CREATE UNIQUE INDEX idx_beneficiaries_phone ON beneficiaries (phone)"]
            });
            console.log("Success!");
        } catch (err: any) {
            console.error("FULL ERROR:", JSON.stringify(err.data, null, 2));
        }

    } catch (e) {
        console.error("Auth Error:", e);
    }
}

main();
