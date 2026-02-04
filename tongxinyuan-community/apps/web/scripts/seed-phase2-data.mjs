import PocketBase from 'pocketbase';

const PB_URL = 'http://127.0.0.1:8090';
const ADMIN_EMAIL = 'root@debug.com';
const ADMIN_PASS = 'Tongxinyuan2026!';

const pb = new PocketBase(PB_URL);

async function main() {
    try {
        await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASS);

        // 1. Create Residents
        console.log('Seeding Residents...');
        const residents = [
            { name: "张三", phone: "13800138000", tags: ["独居", "高龄"], status: "active" },
            { name: "李四", phone: "13900139000", tags: ["重病"], status: "active" },
            { name: "王五", phone: "13700137000", tags: ["低保"], status: "active" },
        ];

        for (const data of residents) {
            try {
                await pb.collection('residents').create(data);
                console.log(`Created resident: ${data.name}`);
            } catch (e) {
                // Ignore if exists? unique constraint might fail but name is not unique. 
                // Maybe just create always.
                console.log(`Failed/Skip resident: ${data.name}`, e.message);
            }
        }

        // 2. Ensure we have a TEST STAFF and draft
        console.log('Ensuring Test Staff...');
        const testEmail = 'tester@worker.com';
        const testPass = '12345678';
        let staffId;

        try {
            const staff = await pb.collection('staff').getFirstListItem(`email="${testEmail}"`);
            staffId = staff.id;
            console.log('Test staff exists.');
        } catch (e) {
            const newStaff = await pb.collection('staff').create({
                email: testEmail,
                emailVisibility: true,
                password: testPass,
                passwordConfirm: testPass,
                name: 'Test Worker',
                role: 'social_worker'
            });
            staffId = newStaff.id;
            console.log('Created test staff.');
        }

        console.log('Creating draft for test staff...');
        try {
            await pb.collection('drafts').create({
                staff: staffId,
                type: 'text',
                content: 'Phase 2 Test Draft for Processing',
                status: 'pending'
            });
            console.log('Created test draft.');
        } catch (e) {
            console.log('Failed to create draft', e.message);
        }

    } catch (e) {
        console.error(e);
    }
}

main();
