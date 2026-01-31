
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

        // 2. Define new fields
        const fileFields = [
            {
                name: 'photos',
                type: 'file',
                maxSelect: 10,
                maxSize: 10485760, // 10MB
                mimeTypes: ["image/jpeg", "image/png", "image/svg+xml", "image/gif", "image/webp"],
                thumbs: ["100x100"]
            },
            {
                name: 'documents',
                type: 'file',
                maxSelect: 10,
                maxSize: 20971520, // 20MB
                mimeTypes: [
                    "application/pdf",
                    "application/msword",
                    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                    "application/vnd.ms-excel",
                    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                    "text/plain",
                    "text/csv"
                ]
            }
        ];

        // 3. Add fields if missing
        const currentNames = new Set(collection.fields.map(f => f.name));
        const fieldsToAdd = fileFields.filter(f => !currentNames.has(f.name));

        if (fieldsToAdd.length > 0) {
            console.log("Adding fields:", fieldsToAdd.map(f => f.name));
            const updatedFields = [...collection.fields, ...fieldsToAdd];

            const updateRes = await fetch(`${PB_URL}/api/collections/activities`, {
                method: 'PATCH',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ fields: updatedFields })
            });

            if (!updateRes.ok) throw new Error(await updateRes.text());
            console.log("Schema updated with file fields.");
        } else {
            console.log("File fields already exist.");
        }

    } catch (e) {
        console.error("Error:", e);
    }
}

main();
