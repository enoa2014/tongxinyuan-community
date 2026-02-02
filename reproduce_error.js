
const PB_PATH = './tongxinyuan-community/apps/web/node_modules/pocketbase/dist/pocketbase.cjs.js';
const PocketBase = require(PB_PATH);

const PB_URL = 'http://127.0.0.1:8091';
const ADMIN_EMAIL = 'root@debug.com';
const ADMIN_PASS = 'Tongxinyuan2026!';

const pb = new PocketBase(PB_URL);

async function main() {
    await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASS);

    // Get a beneficiary ID first
    const ben = await pb.collection('beneficiaries').getFirstListItem('');
    console.log(`Testing with beneficiary: ${ben.id} (${ben.name})`);

    console.log("Fetching family_members...");
    try {
        console.log("Variant 1: No Sort");
        try {
            await pb.collection("family_members").getList(1, 50, {
                filter: `beneficiary="${ben.id}"`
            });
            console.log("✅ Variant 1 Success");
        } catch (e) { console.log("❌ Variant 1 Failed"); }

        console.log("Variant 2: Sort only");
        try {
            await pb.collection("family_members").getList(1, 50, {
                sort: '-created'
            });
            console.log("✅ Variant 2 Success");
        } catch (e) { console.log("❌ Variant 2 Failed"); }

        console.log("Variant 3: Original (Filter + Sort)");
        try {
            await pb.collection("family_members").getList(1, 50, {
                filter: `beneficiary="${ben.id}"`,
                sort: '-created'
            });
            console.log("✅ Variant 3 Success");
        } catch (e) { console.log("❌ Variant 3 Failed"); }
    } catch (e) {
        console.error("❌ Error fetching family_members:");
        console.error("Status:", e.status);
        console.error("Data:", JSON.stringify(e.data, null, 2));
        console.error("Message:", e.message);
    }
}

main().catch(console.error);
