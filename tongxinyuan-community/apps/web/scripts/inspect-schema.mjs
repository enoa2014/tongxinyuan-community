import PocketBase from 'pocketbase';

const PB_URL = 'http://127.0.0.1:8090';
const ADMIN_EMAIL = 'root@debug.com';
const ADMIN_PASS = '12345678';

async function main() {
    const pb = new PocketBase(PB_URL);
    await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASS);

    try {
        const collection = await pb.collections.getOne('drafts');
        console.log("Schema:", JSON.stringify(collection.schema, null, 2));
    } catch (e) {
        console.error("Fetch failed:", e);
    }
}

main();
