// Native fetch is available in Node 18+
// If node 18+, fetch is global. Let's assume Node 18+ or use standard http if needed.
// Safest: use native fetch if available, else http.

async function main() {
    const PB_URL = 'http://localhost:8090';
    const EMAIL = 'temp_admin@tongxy.xyz';
    const PASS = '1234567890';

    console.log('1. Authenticating...');
    // PocketBase v0.23+ uses _superusers collection for admins
    const authRes = await fetch(`${PB_URL}/api/collections/_superusers/auth-with-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identity: EMAIL, password: PASS })
    });

    if (!authRes.ok) {
        console.error('Auth failed:', await authRes.text());
        process.exit(1);
    }
    const authData = await authRes.json();
    const token = authData.token;
    console.log('   Success. Token obtained.');

    console.log('2. Fetching services collection...');
    // Find collection ID or name
    const colRes = await fetch(`${PB_URL}/api/collections/services`, {
        headers: { 'Authorization': token }
    });

    if (!colRes.ok) {
        console.error('Fetch collection failed:', await colRes.text());
        process.exit(1);
    }
    const collection = await colRes.json();
    console.log(`   Found collection: ${collection.name} (ID: ${collection.id})`);

    // Check if field exists
    const fields = collection.schema || collection.fields || []; // v0.23+ uses fields? checks both
    // Actually in v0.23+ 'schema' is deprecated in favor of 'fields' but API usually returns strict structure.
    // Let's inspect what we got.

    // In new PB versions, schema is an array of field definitions.
    // In very new PB, it might be flat. Let's assume standard array schema for now.

    let currentFields = collection.fields || collection.schema;
    if (!Array.isArray(currentFields)) {
        console.log('   Fields structure ambiguous. Raw keys:', Object.keys(collection));
        // Fallback for v0.23+ might be just checking keys? 
        // No, 'fields' is the property name in recent versions.
    }

    const hasOrder = currentFields.find(f => f.name === 'order');
    if (hasOrder) {
        console.log('   "order" field already exists. No action needed.');
        return;
    }

    console.log('3. Adding "order" field...');
    const newField = {
        name: "order",
        type: "number",
        required: false,
        presentable: false,
        unique: false,
        options: {
            min: null,
            max: null,
            noDecimal: true
        }
    };

    const newFields = [...currentFields, newField];

    const updateRes = await fetch(`${PB_URL}/api/collections/${collection.id}`, {
        method: 'PATCH', // or PUT? PATCH usually works.
        headers: {
            'Content-Type': 'application/json',
            'Authorization': token
        },
        body: JSON.stringify({
            fields: newFields
        })
    });

    if (!updateRes.ok) {
        console.error('Update failed:', await updateRes.text());
        process.exit(1);
    }

    console.log('   Success! "order" field added.');
}

// Polyfill fetch for older node if needed, but assuming modern node env
if (!globalThis.fetch) {
    console.error('Node version too old (no fetch). Please use Node 18+.');
    process.exit(1);
}

main().catch(err => {
    console.error(err);
    process.exit(1);
});
