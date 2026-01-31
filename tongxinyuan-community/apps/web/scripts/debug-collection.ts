
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');
const ADMIN_EMAIL = '86152@tongxy.xyz';
const ADMIN_PASS = '1234567890';

async function main() {
    try {
        await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASS);
        const collection = await pb.collections.getOne('activities');
        console.log("Keys:", Object.keys(collection));
        console.log("Schema:", JSON.stringify(collection.schema, null, 2));
        console.log("Fields:", JSON.stringify(collection.fields, null, 2));
    } catch (e) {
        console.error(e);
    }
}
main();
