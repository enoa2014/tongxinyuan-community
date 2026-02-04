import PocketBase from 'pocketbase';

const PB_URL = 'http://127.0.0.1:8090';
const ADMIN_EMAIL = 'root@debug.com';
const ADMIN_PASS = 'Tongxinyuan2026!';

const pb = new PocketBase(PB_URL);
pb.autoCancellation(false);

async function main() {
    try {
        await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASS);

        const drafts = await pb.collection('drafts').getFullList();
        console.log(`Found ${drafts.length} drafts.`);

        for (const draft of drafts) {
            // Check if staff is missing (might be empty string or null if not enforced before)
            // Actually the update failed, so staff is likely empty.
            if (!draft.staff) {
                console.log(`Deleting corrupt draft ${draft.id} (no staff)...`);
                await pb.collection('drafts').delete(draft.id);
            } else if (!draft.status) {
                console.log(`Updating valid draft ${draft.id} status...`);
                await pb.collection('drafts').update(draft.id, { status: 'pending' });
            }
        }
        console.log("Cleanup done.");

    } catch (e) {
        console.error(e);
    }
}

main();
