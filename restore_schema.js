
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

        if (!authRes.ok) throw new Error(await authRes.text());
        const token = (await authRes.json()).token;

        const headers = { 'Authorization': token, 'Content-Type': 'application/json' };

        // Helper to create collection if not exists
        async function ensureCollection(name, data) {
            console.log(`Checking collection: ${name}...`);
            try {
                const check = await fetch(`${BASE_URL}/api/collections/${name}`, { headers });
                if (check.ok) {
                    console.log(`  - Exists. Updating...`);
                     const updateRes = await fetch(`${BASE_URL}/api/collections/${name}`, {
                        method: 'PATCH',
                        headers,
                        body: JSON.stringify(data)
                    });
                     if (!updateRes.ok) console.error(`Failed to update ${name}:`, await updateRes.text());
                     return;
                }
            } catch (e) {}

            console.log(`  - Creating...`);
            const res = await fetch(`${BASE_URL}/api/collections`, {
                method: 'POST',
                headers,
                body: JSON.stringify({ name, ...data })
            });
            if (!res.ok) {
                console.error(`Failed to create ${name}:`, await res.text());
            } else {
                console.log(`  - Created.`);
            }
        }

        // 1. Staff
        await ensureCollection('staff', {
            type: 'auth',
            fields: [
                { name: 'name', type: 'text' },
                { name: 'role', type: 'select', values: ['social_worker', 'web_admin', 'manager'], maxSelect: 1 }
            ]
        });

       // 2. Services
       await ensureCollection('services', {
           type: 'base',
           fields: [
               { name: 'title', type: 'text', required: true },
               { name: 'description', type: 'text' },
               { name: 'icon', type: 'text' },
               { name: 'order', type: 'number' }
           ]
       });

       // 3. Beneficiaries (Minimal)
       await ensureCollection('beneficiaries', {
            type: 'base',
            fields: [
                { name: 'name', type: 'text', required: true },
                { name: 'phone', type: 'text' },
                { name: 'id_card', type: 'text' },
                { name: 'status', type: 'select', values: ['active', 'archived'] }
            ]
       });
       
       // Get beneficiaries ID for relation
       const benRes = await fetch(`${BASE_URL}/api/collections/beneficiaries`, { headers });
       const benId = (await benRes.json()).id;

       // 4. Accommodation Units
       await ensureCollection('accommodation_units', {
           type: 'base',
           fields: [
               { name: 'name', type: 'text', required: true },
               { name: 'type', type: 'select', values: ['building', 'floor', 'room', 'bed'], required: true },
               { name: 'status', type: 'select', values: ['active', 'maintenance', 'occupied'] },
               // Self-relation 'parent' is tricky if collection doesn't exist yet, but we are creating it now.
               // Update it later or assume circular ref works if collection is created.
               // We will omit relation for now to avoid error, or add it in a second pass if needed.
               // Actually PB allows adding relation to self.
           ]
       });
        // Update to add relation
       const unitsRes = await fetch(`${BASE_URL}/api/collections/accommodation_units`, { headers });
       const unitsId = (await unitsRes.json()).id;

       // Update Units with Parent Relation
       await fetch(`${BASE_URL}/api/collections/accommodation_units`, {
            method: 'PATCH',
            headers,
            body: JSON.stringify({
                fields: [
                   { name: 'name', type: 'text', required: true },
                   { name: 'type', type: 'select', values: ['building', 'floor', 'room', 'bed'], required: true },
                   { name: 'status', type: 'select', values: ['active', 'maintenance', 'occupied'] },
                   { name: 'parent', type: 'relation', collectionId: unitsId, maxSelect: 1 }
                ]
            })
       });

       // 5. Accommodation Records
       await ensureCollection('accommodation_records', {
           type: 'base',
           fields: [
               { name: 'beneficiary', type: 'relation', collectionId: benId, required: true, maxSelect: 1 },
               { name: 'unit', type: 'relation', collectionId: unitsId, required: true, maxSelect: 1 },
               { name: 'room_number', type: 'text', required: true },
               { name: 'start_date', type: 'date', required: true },
               { name: 'end_date', type: 'date' },
               { name: 'record_type', type: 'select', values: ['Check-in', 'Extension', 'Check-out', 'Transfer'], required: true },
               { name: 'notes', type: 'text' }
           ]
       });

       console.log('Schema restored.');

    } catch (e) {
        console.error(e);
    }
}

main();
