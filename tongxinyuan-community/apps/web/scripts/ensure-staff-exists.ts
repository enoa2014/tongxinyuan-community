
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');
const ADMIN_EMAIL = '86152@tongxy.xyz';
const ADMIN_PASS = '1234567890';

async function main() {
    try {
        await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASS);

        try {
            await pb.collections.getOne('staff');
            console.log("Staff exists.");
        } catch {
            console.log("Creating empty staff...");
            await pb.collections.create({ name: 'staff', type: 'auth' });
            console.log("Staff created.");
        }
    } catch (e) {
        console.error(e);
    }
}
main();
