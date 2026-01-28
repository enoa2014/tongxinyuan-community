
import PocketBase from 'pocketbase';

async function main() {
    // 1. Setup Direct Connection (Bypass Proxy to isolate backend)
    const pb = new PocketBase('http://127.0.0.1:8090');

    console.log("🔑 Authenticating as Admin...");
    try {
        await pb.admins.authWithPassword('86152@tongxy.xyz', '1234567890');
        console.log("✅ Admin Logged In");
    } catch (e) {
        console.error("❌ Admin Login Failed:", e);
        return;
    }

    try {
        // 2. Inspect Collection Definition
        console.log("\n📂 Fetching Collection Definition...");
        const collection = await pb.collections.getOne('volunteer_applications');
        console.log(`   Name: ${collection.name}`);
        console.log(`   Type: ${collection.type}`); // base, view, auth?
        console.log(`   System Fields: created=${collection.system}`);
        console.log(`   Schema:`, JSON.stringify(collection.schema || collection.fields, null, 2));

        // 3. Inspect Records
        console.log("\n📄 Fetching Records (Direct Admin SDK)...");
        const apps = await pb.collection('volunteer_applications').getFullList();
        console.log(`   Found ${apps.length} records.`);
        if (apps.length > 0) {
            console.log("   First Record Full JSON:", JSON.stringify(apps[0], null, 2));
        }

        const consults = await pb.collection('service_consultations').getFullList();
        console.log(`\nFound ${consults.length} Consultations.`);
        consults.forEach(c => console.log(`   - ${c.name} (${c.id})`));

        // 4. Test Sorts
        console.log("\n🧪 Testing Sort Candidates (Direct SDK)...");
        const tests = ['id', 'created', 'updated', 'name', 'phone'];
        for (const field of tests) {
            try {
                process.stdout.write(`   Sorting by ${field}... `);
                await pb.collection('volunteer_applications').getList(1, 1, { sort: field });
                console.log("✅ OK");
            } catch (e: any) {
                console.log(`❌ FAIL (${e.status})`);
            }
        }

    } catch (e) {
        console.error("❌ Inspection Error:", e);
    }
}

main();
