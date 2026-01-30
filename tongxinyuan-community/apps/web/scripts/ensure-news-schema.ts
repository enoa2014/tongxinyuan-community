
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');
const ADMIN_EMAIL = '86152@tongxy.xyz';
const ADMIN_PASS = '1234567890';

async function main() {
    console.log("📰 Ensuring 'news' Collection Schema (v0.23+ Flattened)...");

    // 1. Login
    try {
        await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASS);
    } catch (e) {
        console.error("❌ Admin Login Failed:", e);
        return;
    }

    // 2. Define Schema (Fields) - FLATTENED STRUCTURE
    const fields = [
        {
            name: "id",
            type: "text",
            required: true,
            primaryKey: true,
            pattern: "^[a-z0-9]+$",
            autogeneratePattern: "[a-z0-9]{15}"
        },
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
            unique: true,
        },
        {
            name: 'description',
            type: 'text',
        },
        {
            name: 'content',
            type: 'editor',
        },
        {
            name: 'author',
            type: 'text',
        },
        {
            name: 'cover',
            type: 'file',
            maxSelect: 1, // Flattened
            maxSize: 5242880, // 5MB Flattened
            mimeTypes: ['image/jpeg', 'image/png', 'image/svg+xml', 'image/gif', 'image/webp'], // Flattened
        },
        {
            name: 'category',
            type: 'select',
            maxSelect: 1, // Flattened
            values: ['news', 'story', 'notice', 'activity'], // Flattened
        },
        {
            name: 'published',
            type: 'bool',
        },
        {
            name: "created",
            type: "autodate",
            onCreate: true,
            onUpdate: false
        },
        {
            name: "updated",
            type: "autodate",
            onCreate: true,
            onUpdate: true
        }
    ];

    // 3. Recreate if broken or missing
    try {
        try {
            const existing = await pb.collections.getOne('news');
            console.log("⚠️ Collection 'news' exists. Checking if valid or legacy...");

            // Heuristic: Check if 'category' field has values (if legacy, it might be empty or wrong structure)
            const catField: any = existing.fields?.find((f: any) => f.name === 'category');
            if (!catField?.values?.length) {
                console.log("🔥 Found BROKEN/LEGACY 'news' collection. Deleting...");
                await pb.collections.delete(existing.id);
                throw { status: 404 };
            } else {
                console.log("✅ Collection seems valid (has flatten properties). Skipping.");
            }

        } catch (e: any) {
            if (e.status === 404) {
                console.log("✨ Creating 'news' collection (New Schema)...");
                await pb.collections.create({
                    name: 'news',
                    type: 'base',
                    fields: fields,
                    system: false,
                    listRule: '',
                    viewRule: '',
                    createRule: null,
                    updateRule: null,
                    deleteRule: null,
                });
                console.log("✅ Collection 'news' created successfully!");
            } else {
                throw e;
            }
        }

    } catch (e: any) {
        console.error("❌ Failed to ensure schema:", e);
        if (e.originalError?.data) {
            console.error("Detailed Error:", JSON.stringify(e.originalError.data, null, 2));
        } else if (e.data) {
            console.error("Error Data:", JSON.stringify(e.data, null, 2));
        }
    }
}

main();
