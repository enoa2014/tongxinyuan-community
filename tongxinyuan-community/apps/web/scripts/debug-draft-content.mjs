import PocketBase from 'pocketbase';

const PB_URL = 'http://127.0.0.1:8090';
const STAFF_EMAIL = 'social@worker.com';
const STAFF_PASS = '12345678';

async function main() {
    const pb = new PocketBase(PB_URL);
    await pb.collection('staff').authWithPassword(STAFF_EMAIL, STAFF_PASS);

    // 1. Fetch one record
    try {
        const list = await pb.collection('drafts').getList(1, 1);
        if (list.items.length > 0) {
            console.log("Record Full JSON:", JSON.stringify(list.items[0], null, 2));
        } else {
            console.log("No items found.");
        }
    } catch (e) {
        console.error("Fetch failed:", e);
    }
}

main();
