
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://localhost:8090');

async function main() {
    try {
        console.log("Authenticating as superuser...");
        await pb.collection('_superusers').authWithPassword('temp@test.com', '1234567890');

        console.log("Fetching collection info...");
        const collection = await pb.collections.getOne('volunteer_applications');
        console.log("Collection Rules:");
        console.log("List Rule:", collection.listRule);
        console.log("View Rule:", collection.viewRule);
        console.log("Create Rule:", collection.createRule);
        console.log("Update Rule:", collection.updateRule);

        console.log("Fetching records as superuser with SORT...");
        const records = await pb.collection('volunteer_applications').getList(1, 10, {
            sort: '-created'
        });
        console.log(`Found ${records.totalItems} records.`);
        if (records.totalItems > 0) {
            console.log("First record:", records.items[0]);
        }

    } catch (error) {
        console.error('Error:', error);
    }
}

main();
