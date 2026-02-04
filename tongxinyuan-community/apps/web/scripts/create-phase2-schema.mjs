import PocketBase from 'pocketbase';

const PB_URL = 'http://127.0.0.1:8090';
const ADMIN_EMAIL = 'root@debug.com';
const ADMIN_PASS = 'Tongxinyuan2026!';

const pb = new PocketBase(PB_URL);

async function main() {
    try {
        console.log('Authenticating as Admin...');
        await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASS);

        // 1. Create 'residents' collection
        console.log('Creating/Updating "residents"...');
        const residentsData = {
            name: "residents",
            type: "base",
            listRule: "id != ''", // TODO: Refine later, currently visible to all auth users? Or maybe just staff? Let's say all auth for now.
            viewRule: "id != ''",
            createRule: "id != ''",
            updateRule: "id != ''",
            deleteRule: null, // Protect deletion
            fields: [
                { name: "name", type: "text", required: true },
                { name: "id_card", type: "text", required: false }, // Should add masking logic in backend hooks ideally
                { name: "phone", type: "text", required: false },
                { name: "address", type: "text", required: false },
                { name: "tags", type: "select", maxSelect: 5, values: ["独居", "重病", "低保", "残疾", "高龄"] },
                { name: "qr_code", type: "text", required: false }, // Unique index? PB constraints
                { name: "status", type: "select", maxSelect: 1, values: ["active", "inactive"] }
            ]
        };

        try {
            await pb.collections.create(residentsData);
            console.log('✅ "residents" created.');
        } catch (err) {
            // If exists, try update? Or ignore?
            // Usually duplicate name error.
            if (err.status === 400 && err.response?.data?.name?.code === 'validation_collection_name_exists') {
                console.log('⚠️ "residents" already exists, skipping create.');
                // Optional: update logic here if schema changed
            } else {
                throw err;
            }
        }

        // Get residents collection ID for relation
        const residentsCol = await pb.collections.getOne('residents');

        // 2. Create 'case_notes' collection
        console.log('Creating/Updating "case_notes"...');
        // We need 'staff' collection ID too.
        const staffCol = await pb.collections.getOne('staff');
        const draftsCol = await pb.collections.getOne('drafts');

        const caseNotesData = {
            name: "case_notes",
            type: "base",
            listRule: "staff = @request.auth.id", // Only see own notes? Or all? Design doc says: staff.id = auth OR FullPermission. Let's stick to own for now or all staff.
            // Actually, usually social workers share cases. Let's make it visible to all staff for now to enable collaboration.
            listRule: "id != ''",
            viewRule: "id != ''",
            createRule: "id != ''",
            updateRule: "staff = @request.auth.id", // Only creator can edit
            deleteRule: null,
            fields: [
                { name: "resident", type: "relation", collectionId: residentsCol.id, maxSelect: 1, required: true },
                { name: "staff", type: "relation", collectionId: staffCol.id, maxSelect: 1, required: true },
                { name: "date", type: "date", required: true },
                { name: "type", type: "select", maxSelect: 1, values: ["上门探访", "电话慰问", "资源配送", "心理疏导"] },
                { name: "content", type: "editor" },
                { name: "source_draft", type: "relation", collectionId: draftsCol.id, maxSelect: 1 },
                // attachments should be 'file' type.
                { name: "attachments", type: "file", maxSelect: 10, maxSize: 5242880, mimeTypes: ["image/jpeg", "image/png", "image/webp", "audio/mpeg", "audio/mp4"] }
            ]
        };

        try {
            await pb.collections.create(caseNotesData);
            console.log('✅ "case_notes" created.');
        } catch (err) {
            if (err.status === 400 && err.response?.data?.name?.code === 'validation_collection_name_exists') {
                console.log('⚠️ "case_notes" already exists, skipping create.');
            } else {
                throw err;
            }
        }


        // 3. Update 'drafts' schema and rules
        console.log('Updating "drafts" schema and ACL...');

        const draftsData = {
            fields: [
                { name: "type", type: "select", maxSelect: 1, values: ["text", "audio", "photo"] },
                { name: "content", type: "text" },
                { name: "file", type: "file", maxSelect: 1, maxSize: 5242880 },
                { name: "staff", type: "relation", collectionId: staffCol.id, maxSelect: 1, required: true },
                { name: "status", type: "select", maxSelect: 1, values: ["pending", "processed"] }
            ],
            listRule: "staff.id = @request.auth.id",
            viewRule: "staff.id = @request.auth.id",
            createRule: "staff.id = @request.auth.id",
            updateRule: "staff.id = @request.auth.id",
            deleteRule: "staff.id = @request.auth.id",
        };

        await pb.collections.update('drafts', draftsData);
        console.log('✅ "drafts" schema and ACL updated.');

    } catch (e) {
        console.error('Script failed:', e);
        if (e.response && e.response.data) {
            console.error('Validation Errors:', JSON.stringify(e.response.data, null, 2));
        }
        process.exit(1);
    }
}

main();
