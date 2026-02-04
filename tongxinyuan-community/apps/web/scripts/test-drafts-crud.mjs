import PocketBase from 'pocketbase';
import FormData from 'form-data';

const PB_URL = 'http://127.0.0.1:8090';
const STAFF_EMAIL = 'social@worker.com';
const STAFF_PASS = '12345678';

async function main() {
    console.log("=== Testing Drafts CRUD (v2) ===");
    const pb = new PocketBase(PB_URL);

    // Try verifying auth against different collections
    let authenticated = false;
    let collectionName = '';

    console.log(`Attempting auth for ${STAFF_EMAIL}...`);

    // Try 'users'
    try {
        await pb.collection('users').authWithPassword(STAFF_EMAIL, STAFF_PASS);
        console.log("SUCCESS: Authenticated via 'users' collection.");
        authenticated = true;
        collectionName = 'users'; // Actually, authStore.model.collectionName should tell us
    } catch (e) {
        console.log("Failed 'users' auth.");
    }

    // Try 'staff' if 'users' failed
    if (!authenticated) {
        try {
            await pb.collection('staff').authWithPassword(STAFF_EMAIL, STAFF_PASS);
            console.log("SUCCESS: Authenticated via 'staff' collection.");
            authenticated = true;
            collectionName = 'staff';
        } catch (e) {
            console.log("Failed 'staff' auth:", e.message);
        }
    }

    if (!authenticated) {
        console.error("FATAL: Could not authenticate with any known collection.");
        process.exit(1);
    }

    console.log("User Model ID:", pb.authStore.model.id);
    console.log("User Collection:", pb.authStore.model.collectionName);

    try {
        // 2. Create Text Draft
        console.log("Creating Text Draft...");
        // Important: Relation field 'staff' expects Record ID. Does it enforce collection?
        // If schema says 'collectionId' of 'staff', and user is in 'users', this might fail or create blank relation.

        const draft = await pb.collection('drafts').create({
            type: 'text',
            content: 'Script Test Content (v2) ' + Date.now(),
            status: 'pending',
            staff: pb.authStore.model.id,
        });
        console.log("Draft created:", draft.id);

        // 3. List Drafts
        console.log("Listing Drafts...");
        const list = await pb.collection('drafts').getList(1, 10);
        console.log(`Found ${list.totalItems} items.`);

        if (list.totalItems > 0) {
            const item = list.items[0];
            console.log("First item:", item);
            console.log("Created Date:", item.created);

            // Verify content
            if (item.content.includes('Script Test Content')) {
                console.log("VERIFIED: Content matches.");
            }
        } else {
            console.error("FATAL: Created item not found in list!");
        }

    } catch (error) {
        console.error("CRUD Test Failed:", error.message);
        console.log("Full error:", JSON.stringify(error, null, 2));
    }
}

main();
