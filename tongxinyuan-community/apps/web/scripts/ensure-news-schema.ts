
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');
const ADMIN_EMAIL = '86152@tongxy.xyz';
const ADMIN_PASS = '1234567890';

async function main() {
    console.log("📰 Ensuring 'news' Collection Schema...");

    // 1. Login
    try {
        await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASS);
        console.log("✅ Admin Logged In");
    } catch (e) {
        console.error("❌ Admin Login Failed:", e);
        return;
    }

    // 2. Define Schema
    const schema = [
        {
            name: 'title',
            type: 'text',
            required: true,
            presentable: true,
        },
        {
            name: 'slug',
            type: 'text',
            required: true,
            unique: true, // URL friendly ID
        },
        {
            name: 'description',
            type: 'text',
            // multiline in UI, standard text in DB
        },
        {
            name: 'content',
            type: 'editor', // Rich text
        },
        {
            name: 'author',
            type: 'text',
        },
        {
            name: 'cover',
            type: 'file',
            options: {
                maxSelect: 1,
                maxSize: 5242880, // 5MB
                mimeTypes: ['image/jpeg', 'image/png', 'image/svg+xml', 'image/gif', 'image/webp'],
            }
        },
        {
            name: 'category',
            type: 'select',
            options: {
                maxSelect: 1,
                values: ['news', 'story', 'notice', 'activity'],
            }
        },
        {
            name: 'published',
            type: 'bool',
        }
    ];

    // 3. Check if exists
    try {
        const existing = await pb.collections.getOne('news');
        console.log("ℹ️ Collection 'news' already exists. (Skipping creation)");
        // Optional: Update schema if needed (skipped for safety to avoid data loss)
    } catch (e: any) {
        if (e.status === 404) {
            console.log("✨ Creating 'news' collection...");
            try {
                await pb.collections.create({
                    name: 'news',
                    type: 'base',
                    schema: schema as any, // TypeScript strictness workaround
                    system: false,
                    listRule: '',   // Public readable
                    viewRule: '',   // Public readable
                    createRule: null, // Admin only
                    updateRule: null, // Admin only
                    deleteRule: null, // Admin only
                });
                console.log("✅ Collection 'news' created successfully!");
            } catch (createError: any) {
                console.error("❌ Failed to create collection:", createError);
                console.error(createError.data);
            }
        } else {
            console.error("❌ Unexpected error fetching collection:", e);
        }
    }
}

main();
