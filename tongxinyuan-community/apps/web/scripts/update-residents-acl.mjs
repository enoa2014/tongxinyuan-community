
import PocketBase from 'pocketbase';

const PB_URL = 'http://127.0.0.1:8090';
const ADMIN_EMAIL = 'root@debug.com';
const ADMIN_PASS = 'Tongxinyuan2026!';

async function main() {
    const pb = new PocketBase(PB_URL);
    try {
        console.log("Authenticating as admin...");
        await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASS);

        console.log("Fetching residents collection...");
        const collection = await pb.collections.getOne('residents');

        console.log("Current deleteRule:", collection.deleteRule);

        console.log("Updating deleteRule to allow authenticated users (@request.auth.id != '')...");
        await pb.collections.update('residents', {
            deleteRule: "@request.auth.id != ''"
        });

        console.log("Successfully updated residents collection ACL.");

    } catch (e) {
        console.error("Failed to update ACL:", e);
        process.exit(1);
    }
}

main();
