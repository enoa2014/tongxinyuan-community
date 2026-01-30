import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

async function main() {
    try {
        console.log("Authenticating via _superusers collection (Frontend Method)...");
        // Use the credentials found in previous step
        await pb.collection('_superusers').authWithPassword('86152@tongxy.xyz', '1234567890');

        console.log("Auth valid:", pb.authStore.isValid);
        console.log("Auth model:", pb.authStore.model);

        console.log("Fetching volunteer applications...");
        const result = await pb.collection('volunteer_applications').getList(1, 10);

        console.log("Count:", result.totalItems);
        console.log("Items:", result.items.length);

    } catch (err) {
        console.error("Error accessing data:", err.message);
        if (err.response) {
            console.error("Response data:", err.response.data);
        }
    }
}

main();
