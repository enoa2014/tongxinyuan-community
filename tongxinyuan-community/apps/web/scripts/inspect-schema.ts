
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8091');

async function inspectSchema() {
    try {
        console.log("Authenticating...");
        await pb.admins.authWithPassword('dev@admin.com', 'dev123456');

        console.log("Fetching accommodation_records collection...");
        const collection = await pb.collections.getOne('accommodation_records');
        console.log(JSON.stringify(collection, null, 2));

    } catch (e) {
        console.error(e);
    }
}

inspectSchema();
