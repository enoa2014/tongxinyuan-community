
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://localhost:8090');

async function main() {
    try {
        // Authenticate
        await pb.collection('_superusers').authWithPassword('temp@test.com', '1234567890');

        // Get collection
        const collection = await pb.collections.getOne('media');
        console.log(JSON.stringify(collection, null, 2));

    } catch (error) {
        console.error('Error:', error);
    }
}

main();
