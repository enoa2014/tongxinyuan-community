// Native fetch used


const BASE_URL = 'http://127.0.0.1:8090';
const ADMIN_EMAIL = 'root@debug.com';
const ADMIN_PASS = 'Tongxinyuan2026!';

async function main() {
    try {
        // 1. Auth
        console.log('Authenticating...');
        const authRes = await fetch(`${BASE_URL}/api/collections/_superusers/auth-with-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ identity: ADMIN_EMAIL, password: ADMIN_PASS })
        });

        if (!authRes.ok) {
            const err = await authRes.text();
            throw new Error(`Auth failed: ${authRes.status} ${err}`);
        }

        const authData = await authRes.json();
        const token = authData.token;
        console.log('Auth successful.');

        // 2. Get Beneficiaries Collection ID
        console.log('Fetching beneficiaries collection...');
        const collectionsRes = await fetch(`${BASE_URL}/api/collections/beneficiaries`, {
            headers: { 'Authorization': token }
        });
        const benefCollection = await collectionsRes.json();
        const benefId = benefCollection.id;
        console.log(`Beneficiaries ID: ${benefId}`);

        // 3. Define New Schema
        const newSchema = [
            {
                name: "beneficiary",
                type: "relation",
                required: true,
                collectionId: benefId,
                cascadeDelete: true,
                maxSelect: 1
            },
            {
                name: "room_number",
                type: "text",
                required: true
            },
            {
                name: "start_date",
                type: "date",
                required: true
            },
            {
                name: "end_date",
                type: "date",
                required: false
            },
            {
                name: "record_type",
                type: "select",
                required: true,
                values: ["Check-in", "Extension", "Check-out", "Transfer"],
                maxSelect: 1
            },
            {
                name: "notes",
                type: "text",
                required: false
            }
        ];

        // 4. Update accommodation_records
        console.log('Updating accommodation_records schema...');
        // First get the collection to get its ID
        const accRes = await fetch(`${BASE_URL}/api/collections/accommodation_records`, {
            headers: { 'Authorization': token }
        });

        let accId;
        if (accRes.ok) {
            const accData = await accRes.json();
            accId = accData.id;
            console.log(`Found existing collection: ${accId}`);

            // Update
            const updateRes = await fetch(`${BASE_URL}/api/collections/accommodation_records`, {
                method: 'PATCH', // Or PUT? API docs say PATCH for update usually, but for collections it might be by ID
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    fields: newSchema
                })
            });

            // Actually, usually update is /api/collections/{id}
            const updateRes2 = await fetch(`${BASE_URL}/api/collections/${accId}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    fields: newSchema
                })
            });

            if (!updateRes2.ok) {
                console.log(await updateRes2.text());
                throw new Error(`Update failed: ${updateRes2.status}`);
            }
            console.log('Update successful!');
            console.log(await updateRes2.json());

        } else {
            console.log('Collection not found, creating...');
            // Create
            const createRes = await fetch(`${BASE_URL}/api/collections`, {
                method: 'POST',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: "accommodation_records",
                    type: "base",
                    schema: newSchema,
                    createRule: "@request.auth.id != ''",
                    listRule: "@request.auth.id != ''",
                    viewRule: "@request.auth.id != ''",
                    updateRule: "@request.auth.id != ''",
                    deleteRule: "@request.auth.id != ''",
                })
            });
            if (!createRes.ok) {
                console.log(await createRes.text());
                throw new Error(`Create failed: ${createRes.status}`);
            }
            console.log('Create successful!');
        }

    } catch (e) {
        console.error(e);
    }
}

main();
