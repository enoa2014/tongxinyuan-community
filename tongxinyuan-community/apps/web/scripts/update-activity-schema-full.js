
const PB_URL = 'http://127.0.0.1:8090';
const ADMIN_EMAIL = '86152@tongxy.xyz';
const ADMIN_PASS = '1234567890';

async function main() {
    try {
        console.log("Authenticating...");
        const authRes = await fetch(`${PB_URL}/api/collections/_superusers/auth-with-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ identity: ADMIN_EMAIL, password: ADMIN_PASS })
        });

        if (!authRes.ok) throw new Error(await authRes.text());
        const { token } = await authRes.json();

        // 1. Fetch current schema
        console.log("Fetching activities collection...");
        const colRes = await fetch(`${PB_URL}/api/collections/activities`, {
            headers: { 'Authorization': token }
        });
        const collection = await colRes.json();

        // 2. Define fields to valid/update
        const newFields = [
            {
                name: 'videos',
                type: 'file',
                maxSelect: 5,
                maxSize: 524288000, // 500MB
                mimeTypes: ["video/mp4", "video/webm", "video/quicktime", "video/x-msvideo"]
            },
            {
                name: 'external_links',
                type: 'json',
                // JSON field doesn't need much config, will store array of objects
            }
        ];

        // Documents config to update
        const documentConfig = {
            name: 'documents',
            type: 'file',
            maxSelect: 10,
            maxSize: 52428800, // 50MB
            mimeTypes: [
                "application/pdf",
                "application/msword",
                "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // docx
                "application/vnd.ms-excel",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // xlsx
                "application/vnd.ms-powerpoint",
                "application/vnd.openxmlformats-officedocument.presentationml.presentation", // pptx
                "text/plain",
                "text/markdown",
                "text/csv"
            ]
        };

        // 3. Process fields
        let updatedFields = [...collection.fields];
        let hasChanges = false;

        // Add proper videos and external_links if missing
        const currentNames = new Set(collection.fields.map(f => f.name));
        newFields.forEach(field => {
            if (!currentNames.has(field.name)) {
                console.log(`Adding new field: ${field.name}`);
                updatedFields.push(field);
                hasChanges = true;
            }
        });

        // Update documents field if exists
        updatedFields = updatedFields.map(field => {
            if (field.name === 'documents') {
                console.log("Updating documents field config...");
                hasChanges = true;
                return { ...field, ...documentConfig };
            }
            return field;
        });

        if (hasChanges) {
            console.log("Applying schema updates...");
            const updateRes = await fetch(`${PB_URL}/api/collections/activities`, {
                method: 'PATCH',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ fields: updatedFields })
            });

            if (!updateRes.ok) throw new Error(await updateRes.text());
            console.log("Schema updated successfully!");
        } else {
            console.log("No schema changes needed.");
        }

    } catch (e) {
        console.error("Error:", e);
    }
}

main();
