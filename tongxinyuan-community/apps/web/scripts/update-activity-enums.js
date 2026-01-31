
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

        // 2. Find and update specific fields
        const updatedFields = collection.fields.map(field => {
            if (field.name === 'status') {
                console.log("Updating status options...");
                return {
                    ...field,
                    values: ['planning', 'recruiting', 'ongoing', 'review', 'completed']
                };
            }
            if (field.name === 'category') {
                console.log("Updating category options...");
                return {
                    ...field,
                    values: ['home_care', 'festival', 'school_visit', 'home_visit', 'training', 'other']
                };
            }
            return field;
        });

        // 3. Patch the collection
        const updateRes = await fetch(`${PB_URL}/api/collections/activities`, {
            method: 'PATCH',
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ fields: updatedFields })
        });

        if (!updateRes.ok) throw new Error(await updateRes.text());
        console.log("Schema enums updated successfully!");

    } catch (e) {
        console.error("Error:", e);
    }
}

main();
