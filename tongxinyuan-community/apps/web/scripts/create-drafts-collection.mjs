import PocketBase from 'pocketbase';

const PB_URL = 'http://127.0.0.1:8090'; // Use the port we verified
const ADMIN_EMAIL = 'root@debug.com';
const ADMIN_PASSWORD = 'Tongxinyuan2026!';

async function main() {
    const pb = new PocketBase(PB_URL);

    try {
        // 1. Authenticate
        console.log('Authenticating as admin...');
        await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASSWORD);
        console.log('Authentication successful.');

        // 2a. List collections to verify dependencies
        const collections = await pb.collections.getFullList();
        console.log('Existing collections:', collections.map(c => c.name).join(', '));

        if (!collections.find(c => c.name === 'staff')) {
            console.warn('WARNING: "staff" collection not found! Relation might fail.');
            // Fallback to "users" if staff missing
        }

        // 3. Create Collection
        const collection = await pb.collections.create({
            name: 'drafts',
            type: 'base',
            schema: [
                {
                    name: 'type',
                    type: 'select',
                    required: true,
                    options: {
                        maxSelect: 1,
                        values: ['audio', 'text', 'photo']
                    }
                },
                {
                    name: 'content',
                    type: 'text',
                    required: false
                },
                {
                    name: 'file',
                    type: 'file',
                    required: false,
                    options: {
                        maxSelect: 1,
                        maxSize: 52428800, // 50MB
                        mimeTypes: [
                            "image/jpeg",
                            "image/png",
                            "image/svg+xml",
                            "image/gif",
                            "image/webp",
                            "audio/mpeg",
                            "audio/wave",
                            "audio/wav",
                            "audio/x-wav",
                            "audio/mp3",
                            "audio/webm",
                            "audio/ogg"
                        ]
                    }
                },
                {
                    name: 'staff', // Relation to the staff member who created it
                    type: 'relation',
                    required: true,
                    options: {
                        collectionId: 'staff',
                        cascadeDelete: false,
                        maxSelect: 1,
                        displayFields: []
                    }
                },
                {
                    name: 'status',
                    type: 'select',
                    required: true,
                    options: {
                        maxSelect: 1,
                        values: ['pending', 'processed', 'archived']
                    }
                }
            ],
            // ACL Rules: Simplified for debugging/initial creation
            listRule: "@request.auth.id != ''",
            viewRule: "@request.auth.id != ''",
            createRule: "@request.auth.id != ''",
            updateRule: "@request.auth.id != ''",
            deleteRule: "@request.auth.id != ''",
        });

        console.log('Collection "drafts" created successfully:', collection.id);

    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

main();
