
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://localhost:8090');

async function main() {
    try {
        await pb.collection('_superusers').authWithPassword('temp@test.com', '1234567890');

        await pb.collections.update('media', {
            createRule: "", // Public
        });
        console.log("Media collection is now public.");

    } catch (error) {
        console.error('Error:', error);
    }
}

main();
