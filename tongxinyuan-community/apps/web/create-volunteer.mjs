
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://localhost:8090');

async function main() {
    try {
        await pb.collection('_superusers').authWithPassword('temp@test.com', '1234567890');

        const data = {
            "name": "Test Volunteer",
            "phone": "13800138000",
            "email": "test@volunteer.com",
            "status": "pending",
            "motivation": "I want to help.",
            "skills": {
                "level": "level1",
                "list": ["Driving"]
            },
            "history": []
        };

        const record = await pb.collection('volunteer_applications').create(data);
        console.log("Created volunteer:", record.id);

    } catch (error) {
        console.error('Error:', error);
    }
}

main();
