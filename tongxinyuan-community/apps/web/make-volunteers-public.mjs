import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

async function main() {
    try {
        console.log("Authenticating as superuser...");
        await pb.admins.authWithPassword('86152@tongxy.xyz', '1234567890');

        console.log("Fetching collection info...");
        const collection = await pb.collections.getOne('volunteer_applications');

        console.log("Current Rules:", {
            listRule: collection.listRule,
            viewRule: collection.viewRule
        });

        console.log("Updating rules to Public (empty string)...");
        await pb.collections.update(collection.id, {
            listRule: "",
            viewRule: ""
        });

        console.log("Successfully updated collection rules.");
    } catch (err) {
        console.error("Error:", err);
        if (err.response && err.response.data) {
            console.error("Validation Errors:", JSON.stringify(err.response.data, null, 2));
        }
    }
}

main();
