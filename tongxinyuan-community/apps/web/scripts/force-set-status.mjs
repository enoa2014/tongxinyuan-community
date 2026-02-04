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
            if (!draft.status) {
                console.log(`Updating ${draft.id} status to pending...`);
                try {
                    await pb.collection('drafts').update(draft.id, {
                        status: 'pending'
                    });
                    console.log(`  -> pending`);
                } catch (e) {
                    console.error(`  Failed: ${e.message}`, e.response);
                }
            } else {
                console.log(`Skipping ${draft.id}, status: ${draft.status}`);
            }
        }

    } catch (e) {
        console.error(e);
    }
}

main();
