import PocketBase from 'pocketbase';

const PB_URL = 'http://127.0.0.1:8090';
const ADMIN_EMAIL = 'root@debug.com';
const ADMIN_PASS = 'Tongxinyuan2026!';

const pb = new PocketBase(PB_URL);

async function main() {
    try {
        await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASS);

        const drafts = await pb.collection('drafts').getFullList();
        console.log(`Found ${drafts.length} drafts.`);

        for (const draft of drafts) {
            console.log(`Updating ${draft.id} (${draft.status})...`);
            try {
                // Force update to pending if empty, or just re-save to ensure index
                const newStatus = draft.status || 'pending';
                await pb.collection('drafts').update(draft.id, {
                    status: newStatus
                });
                console.log(`  -> ${newStatus}`);
            } catch (e) {
                console.error(`  Failed: ${e.message}`);
            }
        }

    } catch (e) {
        console.error(e);
    }
}

main();
