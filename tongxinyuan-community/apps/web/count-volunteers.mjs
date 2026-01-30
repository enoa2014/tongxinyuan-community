import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

async function main() {
    try {
        console.log("Authenticating as superuser...");
        await pb.admins.authWithPassword('86152@tongxy.xyz', '1234567890');

        console.log("Fetching volunteer count...");
        const result = await pb.collection('volunteer_applications').getList(1, 1, { count: true });

        console.log("Total Volunteers:", result.totalItems);
        console.log("First Item (if any):", result.items[0]);

    } catch (err) {
        console.error("Error:", err);
    }
}

main();
