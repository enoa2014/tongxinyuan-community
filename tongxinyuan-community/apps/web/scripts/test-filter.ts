
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8091');

async function testFilter() {
    try {
        console.log("Authenticating...");
        await pb.admins.authWithPassword('dev@admin.com', 'dev123456');

        console.log("Testing sort variations...");
        const unit = (await pb.collection('accommodation_units').getList(1, 1)).items[0];
        if (!unit) return;

        const sorts = [
            '-created',
            'created',
            '-updated',
            '-start_date',
            ''
        ];

        const filter = `unit = "${unit.id}" && record_type = "Check-in"`;

        for (const s of sorts) {
            console.log(`\nTesting Sort: "${s}"`);
            try {
                const res = await pb.collection("accommodation_records").getList(1, 1, {
                    filter: filter,
                    sort: s,
                    expand: 'beneficiary'
                });
                console.log(`✅ Success (Found ${res.totalItems})`);
            } catch (e: any) {
                console.log("❌ Failed:", e.status);
            }
        }

    } catch (e) {
        console.error("Fatal:", e);
    }
}

testFilter();
