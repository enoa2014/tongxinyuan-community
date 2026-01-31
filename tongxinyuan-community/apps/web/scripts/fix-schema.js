
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

        if (!authRes.ok) {
            // Fallback for older PB versions or standard 'users' collection just in case
            console.log("Superuser auth failed, trying admins...");
            // Actually v0.23+ uses _superusers. If that failed, credentials might be wrong OR it's a different setup.
            throw new Error(await authRes.text());
        }
        const { token } = await authRes.json();
        console.log("Authenticated.");

        console.log("Fetching activities collection...");
        const colRes = await fetch(`${PB_URL}/api/collections/activities`, {
            headers: { 'Authorization': token }
        });
        const collection = await colRes.json();

        // Fetch staff collection to get ID
        const staffRes = await fetch(`${PB_URL}/api/collections/staff`, {
            headers: { 'Authorization': token }
        });
        const staffCollection = await staffRes.json();

        console.log("Current fields:", collection.fields.map(f => f.name));

        const newFields = [
            { name: 'start_time', type: 'date' },
            { name: 'end_time', type: 'date' },
            { name: 'location', type: 'text' },
            { name: 'summary', type: 'text' },
            {
                name: 'lead_staff',
                type: 'relation',
                collectionId: staffCollection.id,
                cascadeDelete: false,
                maxSelect: 1
            },
            {
                name: 'status',
                type: 'select',
                maxSelect: 1,
                values: ['planned', 'active', 'completed', 'cancelled']
            },
            {
                name: 'category',
                type: 'select',
                maxSelect: 1,
                values: ['visit', 'event', 'support', 'other']
            }
        ];

        const currentFieldNames = new Set(collection.fields.map(f => f.name));
        const fieldsToAdd = newFields.filter(f => !currentFieldNames.has(f.name));

        if (fieldsToAdd.length === 0) {
            console.log("No new fields to add.");
            return;
        }

        const updatedFields = [...collection.fields, ...fieldsToAdd];

        console.log("Updating collection...");
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

    } catch (e) {
        console.error("Error:", e);
    }
}

main();
