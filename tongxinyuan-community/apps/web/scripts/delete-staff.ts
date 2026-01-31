
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');
const ADMIN_EMAIL = '86152@tongxy.xyz';
const ADMIN_PASS = '1234567890';

async function main() {
    try {
        await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASS);
        try {
            await pb.collections.delete('staff');
            console.log("Deleted staff collection");
        } catch (e) {
            console.log("Staff collection not found or already deleted");
        }
    } catch (e) {
        console.error(e);
    }
}
main();
