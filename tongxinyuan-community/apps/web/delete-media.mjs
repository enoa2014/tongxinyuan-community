
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://localhost:8090');

async function main() {
    try {
        await pb.collection('_superusers').authWithPassword('temp@test.com', '1234567890');
        try {
            await pb.collections.delete('media');
            console.log('Deleted media collection.');
        } catch (e) {
            console.log('Media collection not found or already deleted.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

main();
