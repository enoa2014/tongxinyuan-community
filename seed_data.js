
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

        // 1. Create Staff
        console.log('Creating Staff...');
        try {
            await fetch(`${BASE_URL}/api/collections/staff/records`, {
                method: 'POST',
                headers,
                body: JSON.stringify({
                    email: 'dev@monitor.com',
                    password: 'password123',
                    passwordConfirm: 'password123',
                    name: 'Test Staff',
                    role: 'social_worker',
                    emailVisibility: true
                })
            });
        } catch (e) { console.log('Staff maybe exists'); }

        // 2. Create Beneficiary
        console.log('Creating Beneficiary...');
        const benRes = await fetch(`${BASE_URL}/api/collections/beneficiaries/records`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                name: 'Test Child',
                phone: '13800000000',
                status: 'active'
            })
        });
        const benData = await benRes.json();
        const benId = benData.id;

        // 3. Create Unit
        console.log('Creating Unit...');
        const unitRes = await fetch(`${BASE_URL}/api/collections/accommodation_units/records`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                name: 'Room 101',
                type: 'room',
                status: 'active'
            })
        });
        const unitData = await unitRes.json();
        const unitId = unitData.id;

        // 4. Create Check-IN Record (so we can test check-out)
        console.log('Creating Check-in Record...');
        await fetch(`${BASE_URL}/api/collections/accommodation_records/records`, {
            method: 'POST',
            headers,
            body: JSON.stringify({
                beneficiary: benId,
                unit: unitId,
                room_number: '101',
                start_date: new Date().toISOString(),
                record_type: 'Check-in',
                notes: 'Initial checkin'
            })
        });

        // Update Unit Status to Occupied
        await fetch(`${BASE_URL}/api/collections/accommodation_units/records/${unitId}`, {
            method: 'PATCH',
            headers,
            body: JSON.stringify({
                status: 'occupied'
            })
        });

        console.log('Seed done.');

    } catch (e) {
        console.error(e);
    }
}

main();
