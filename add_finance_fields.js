
const BASE_URL = 'http://127.0.0.1:8091';
const ADMIN_EMAIL = 'root@debug.com';
const ADMIN_PASS = 'Tongxinyuan2026!';

async function main() {
    try {
        console.log('Authenticating...');
        const authRes = await fetch(`${BASE_URL}/api/collections/_superusers/auth-with-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ identity: ADMIN_EMAIL, password: ADMIN_PASS })
        });
        const token = (await authRes.json()).token;
        const headers = { 'Authorization': token, 'Content-Type': 'application/json' };

        console.log('Fetching accommodation_records collection...');
        const colRes = await fetch(`${BASE_URL}/api/collections/accommodation_records`, { headers });
        const collection = await colRes.json();

        let newFields = [...collection.fields];

        // Add Fee
        if (!newFields.find(f => f.name === 'total_fee')) {
            newFields.push({ name: 'total_fee', type: 'number', required: false });
        }

        // Add Is Waived
        if (!newFields.find(f => f.name === 'is_waived')) {
            newFields.push({ name: 'is_waived', type: 'bool', required: false });
        }

        // Add Waiver Reason
        if (!newFields.find(f => f.name === 'waiver_reason')) {
            newFields.push({ name: 'waiver_reason', type: 'text', required: false });
        }

        console.log('Updating schema...');
        const updateRes = await fetch(`${BASE_URL}/api/collections/accommodation_records`, {
            method: 'PATCH',
            headers,
            body: JSON.stringify({ fields: newFields })
        });

        if (!updateRes.ok) throw new Error(await updateRes.text());
        console.log('Schema updated successfully.');

    } catch (e) {
        console.error(e);
    }
}

main();
