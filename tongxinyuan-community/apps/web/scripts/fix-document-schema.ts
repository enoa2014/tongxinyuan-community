
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8091');

async function fixSchema() {
    try {
        console.log("Authenticating as admin...");
        await pb.admins.authWithPassword('dev@admin.com', 'dev123456');

        console.log("Fetching collection 'beneficiary_documents'...");
        const collection = await pb.collections.getOne('beneficiary_documents');

        // PB v0.23+ uses 'fields'
        const currentFields = collection.fields || collection.schema || [];
        console.log("Current fields:", currentFields.map((f: any) => f.name));

        // Remove system fields (id, created, updated) for update
        const newFields = currentFields.filter((f: any) => !['id', 'created', 'updated'].includes(f.name));

        // Helper to check if field exists
        const hasField = (name: string) => newFields.some((f: any) => f.name === name);

        // 1. Add 'beneficiary' relation if missing
        if (!hasField('beneficiary') && !hasField('beneficiary_id')) {
            console.log("Adding 'beneficiary' relation field...");
            const beneficiariesCol = await pb.collections.getOne('beneficiaries');
            newFields.push({
                name: 'beneficiary',
                type: 'relation',
                required: true,
                presentable: false,
                unique: false,
                collectionId: beneficiariesCol.id,
                cascadeDelete: false,
                minSelect: null,
                maxSelect: 1,
                displayFields: null
            });
        }

        // 2. Add 'title' text if missing
        if (!hasField('title')) {
            console.log("Adding 'title' field...");
            newFields.push({
                name: 'title',
                type: 'text',
                required: false,
                presentable: false,
                unique: false,
                pattern: ""
            });
        }

        // 3. Add 'category' select if missing
        if (!hasField('category')) {
            console.log("Adding 'category' field...");
            newFields.push({
                name: 'category',
                type: 'select',
                required: false,
                presentable: false,
                unique: false,
                maxSelect: 1,
                values: ["Medical Report", "ID Document", "Application Form", "Agreement", "Other"]
            });
        }

        // 4. Add 'file' field if missing
        if (!hasField('file')) {
            console.log("Adding 'file' field...");
            newFields.push({
                name: 'file',
                type: 'file',
                required: true,
                presentable: false,
                unique: false,
                mimeTypes: [],
                thumbs: [],
                maxSelect: 1,
                maxSize: 10485760, // 10MB
                protected: false
            });
        }

        console.log("Updating collection fields...");
        await pb.collections.update(collection.id, { fields: newFields });
        console.log("Schema updated successfully!");

    } catch (e: any) {
        console.error("Error:", JSON.stringify(e.originalError?.data || e, null, 2));
    }
}

fixSchema();
