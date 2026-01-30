
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://localhost:8090');

async function main() {
    try {
        // 1. Authenticate
        await pb.collection('_superusers').authWithPassword('temp@test.com', '1234567890');
        console.log('Authenticated as superuser.');

        // 2. Check if collection exists
        try {
            await pb.collections.getOne('media');
            console.log('Collection "media" already exists.');
        } catch (e) {
            // 3. Create collection
            console.log('Creating "media" collection...');
            await pb.collections.create({
                name: 'media',
                type: 'base',
                fields: [
                    {
                        name: 'file',
                        type: 'file',
                        required: true,
                        presentable: false,
                        unique: false,
                        maxSelect: 1,
                        maxSize: 5242880, // 5MB
                        mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
                        thumbs: [],
                        protected: false
                    },
                    {
                        name: 'alt',
                        type: 'text',
                        required: false,
                        presentable: false,
                        unique: false
                    }
                ],
                listRule: "", // Public
                viewRule: "", // Public
                createRule: "@request.auth.id != ''", // Authenticated users
                updateRule: "@request.auth.id != ''",
                deleteRule: "@request.auth.id != ''",
            });
            console.log('Collection "media" created successfully.');
        }

    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

main();
