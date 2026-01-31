
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');
const ADMIN_EMAIL = '86152@tongxy.xyz';
const ADMIN_PASS = '1234567890';

async function main() {
    try {
        await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASS);

        const collections = ['activity_participations', 'activities', 'beneficiaries'];

        for (const name of collections) {
            try {
                await pb.collections.delete(name);
                console.log(`Deleted collection '${name}'`);
            } catch (e) {
                console.log(`Collection '${name}' not found or already deleted.`);
            }
        }

    } catch (e) {
        console.error(e);
    }
}
main();
