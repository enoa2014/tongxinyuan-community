
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');
const ADMIN_EMAIL = '86152@tongxy.xyz';
const ADMIN_PASS = '1234567890';

async function main() {
    try {
        await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASS);

        console.log("Creating beneficiaries (minimal)...");

        let collectionId = "";
        try {
            const col = await pb.collections.create({
                name: 'beneficiaries',
                type: 'base',
                fields: [
                    { name: 'name', type: 'text', required: true }
                ]
            });
            console.log("Beneficiaries created. ID:", col.id);
            collectionId = col.id;
        } catch (e: any) {
            console.log("Creation failed (or exists). Checking...", e.status);
            try {
                const col = await pb.collections.getOne('beneficiaries');
                collectionId = col.id;
                console.log("Found existing beneficiaries. ID:", collectionId);
            } catch {
                console.error("Fatal: Could not create or find beneficiaries.");
                return;
            }
        }

        // Fetch service_consultations ID
        let serviceColId = 'service_consultations';
        try {
            const sc = await pb.collections.getOne('service_consultations');
            serviceColId = sc.id;
        } catch {
            console.log("Warning: service_consultations not found. Relation might fail.");
        }

        // Update with full fields
        console.log("Updating fields...");
        try {
            const col = await pb.collections.getOne(collectionId);

            // Helper to check if field exists to avoid dupes if running multiple times
            // But PB overwrites/updates if ID matches? No, fields is an array.
            // We should use a cleaner approach: Get current fields, append new ones if not exist?
            // PocketBase API requires sending the FULL field list for update.

            const newFields = [...col.fields];

            const fieldsDef = [
                { name: 'phone', type: 'text', required: true }, // we will add unique index later
                { name: 'id_card', type: 'text' },
                { name: 'category', type: 'select', options: { values: ['cancer', 'leukemia', 'congenital_heart', 'nephrosis', 'other'], maxSelect: 1 } },
                { name: 'status', type: 'select', options: { values: ['active', 'archived', 'deceased'], maxSelect: 1 } },
                { name: 'guardian_name', type: 'text' },
                { name: 'guardian_phone', type: 'text' },
                { name: 'address', type: 'text' },
                { name: 'hospital', type: 'text' },
                { name: 'profile', type: 'json' }, // Flexible additional data
                { name: 'service_records', type: 'relation', collectionId: serviceColId, options: { maxSelect: null } }
            ];

            // Naive merge: remove old instances of these fields and add new definition
            // This resets them.
            const namesToUpdate = fieldsDef.map(f => f.name);
            const mergedFields = newFields.filter((f: any) => !namesToUpdate.includes(f.name));
            mergedFields.push(...fieldsDef);

            col.fields = mergedFields;

            // Update Rules
            col.listRule = "@request.auth.collectionName = 'staff'";
            col.viewRule = "@request.auth.collectionName = 'staff' || @request.auth.mobile = phone"; // Allow self-check by phone? No, auth.mobile is not standard.
            // For status check, we might use a public sensitive route or a specific API action.
            // Let's keep it secure: staff only by default. The content is sensitive.
            col.listRule = "@request.auth.collectionName = 'staff'";
            col.viewRule = "@request.auth.collectionName = 'staff'";

            await pb.collections.update(collectionId, col);
            console.log("Beneficiaries updated successfully.");

            // Create Index for Phone (if not exists)
            console.log("Ensuring unique index on phone...");
            // PB uses 'indexes' property array of strings: "CREATE UNIQUE INDEX `idx_phone` ON `beneficiaries` (`phone`)"
            if (!col.indexes.some((i: string) => i.includes('idx_phone'))) {
                col.indexes.push("CREATE UNIQUE INDEX `idx_phone` ON `beneficiaries` (`phone`)");
                await pb.collections.update(collectionId, col);
                console.log("Index added.");
            }

        } catch (e: any) {
            console.log("Update Error:", JSON.stringify(e.data || e, null, 2));
        }

    } catch (e) {
        console.error(e);
    }
}
main();
