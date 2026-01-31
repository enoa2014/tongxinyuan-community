
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');
const ADMIN_EMAIL = '86152@tongxy.xyz';
const ADMIN_PASS = '1234567890';

async function main() {
    try {
        await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASS);

        console.log("Creating test beneficiary...");
        const data = {
            name: "张三 (Test)",
            phone: "13800000000",
            status: "active",
            category: "cancer"
        };

        try {
            const record = await pb.collection('beneficiaries').create(data);
            console.log("Test beneficiary created. Phone: 13800000000");
        } catch (e: any) {
            // If phone unique constraint fails, it means it exists.
            console.log("Creation failed (might exist):", e.status);
            // Try updating it strictly with phone query
            try {
                const existing = await pb.collection('beneficiaries').getFirstListItem('phone="13800000000"');
                await pb.collection('beneficiaries').update(existing.id, data);
                console.log("Test beneficiary updated.");
            } catch (err) {
                console.error("Update failed:", err);
            }
        }

    } catch (e) {
        console.error(e);
    }
}
main();
