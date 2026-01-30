import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

async function main() {
    try {
        console.log("Authenticating as superuser...");
        await pb.collection('_superusers').authWithPassword('86152@tongxy.xyz', '1234567890');

        console.log("Fetching service consultations...");
        const result = await pb.collection('service_consultations').getList(1, 10);

        console.log("Total:", result.totalItems);
        if (result.totalItems > 0) {
            console.log("First item:", result.items[0]);
        } else {
            console.log("No consultations found. Creating a test record...");
            const created = await pb.collection('service_consultations').create({
                name: 'Test User',
                phone: '13888888888',
                service_type: 'accommodation',
                description: 'Need help with housing near hospital.',
                status: 'pending'
            });
            console.log("Created test record:", created);
        }

    } catch (err) {
        console.error("Error:", err);
    }
}

main();
