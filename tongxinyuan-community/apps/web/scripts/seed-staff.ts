
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

// Configuration
const ADMIN_EMAIL = '86152@tongxy.xyz';
const ADMIN_PASS = '1234567890';

const STAFF_USERS = [
    {
        username: 'admin_user',
        email: 'admin@tongxy.xyz',
        emailVisibility: true,
        password: 'password123',
        passwordConfirm: 'password123',
        name: '系统管理员',
        role: 'web_admin'
    },
    {
        username: 'worker_user',
        email: 'worker@tongxy.xyz',
        emailVisibility: true,
        password: 'password123',
        passwordConfirm: 'password123',
        name: '一线社工',
        role: 'social_worker'
    },
    {
        username: 'manager_user',
        email: 'manager@tongxy.xyz',
        emailVisibility: true,
        password: 'password123',
        passwordConfirm: 'password123',
        name: '机构负责人',
        role: 'manager'
    }
];

async function main() {
    try {
        console.log("Authenticating as super-admin...");
        await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASS);

        for (const user of STAFF_USERS) {
            try {
                // Check if exists
                const existing = await pb.collection('staff').getFirstListItem(`email="${user.email}"`);
                console.log(`User ${user.email} already exists. ID: ${existing.id}`);
            } catch (e) {
                // Create
                console.log(`Creating user ${user.email} (${user.role})...`);
                await pb.collection('staff').create(user);
                console.log(`Created.`);
            }
        }

    } catch (e) {
        console.error("Error:", e);
    }
}

main();
