import PocketBase from 'pocketbase';

const PB_URL = 'http://127.0.0.1:8090';

const testEmail = 'tester@worker.com';
const testPass = '12345678';

async function main() {
    const pb = new PocketBase(PB_URL);
    try {
        await pb.collection('staff').authWithPassword(testEmail, testPass);
        console.log("Logged in as", pb.authStore.model.email);

        console.log("Attempt 1: status = \"pending\"");
        try {
            const result = await pb.collection('drafts').getList(1, 50, {
                filter: 'status = "pending"'
            });
            console.log("Success 1, found:", result.totalItems);
        } catch (e) {
            console.log("Failed 1:", e.status, e.response);
        }

        console.log("Attempt 2: status = 'pending'");
        try {
            const result2 = await pb.collection('drafts').getList(1, 50, {
                filter: "status = 'pending'"
            });
            console.log("Success 2, found:", result2.totalItems);
        } catch (e) {
            console.log("Failed 2:", e.status, e.response);
        }

    } catch (e) {
        console.error("Login failed or other error", e);
    }
}

main();
