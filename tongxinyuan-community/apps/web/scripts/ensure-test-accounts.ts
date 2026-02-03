
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8091');
const SUPERUSER_EMAIL = 'root@debug.com';
const SUPERUSER_PASS = 'Tongxinyuan2026!';

async function main() {
    try {
        console.log("Authenticating as Superuser...");
        await pb.collection('_superusers').authWithPassword(SUPERUSER_EMAIL, SUPERUSER_PASS);

        const accounts = [
            { email: 'dev@manager.com', password: '12345678', name: 'Dev Manager', role: 'manager' },
            { email: 'dev@admin.com', password: '12345678', name: 'Dev Admin', role: 'admin' },
            { email: 'social@worker.com', password: '12345678', name: 'Social Worker', role: 'social_worker' }
        ];

        for (const acc of accounts) {
            try {
                // Check if exists
                const records = await pb.collection('staff').getList(1, 1, { filter: `email = "${acc.email}"` });
                if (records.totalItems === 0) {
                    console.log(`Creating ${acc.email}...`);
                    await pb.collection('staff').create({
                        email: acc.email,
                        emailVisibility: true,
                        password: acc.password,
                        passwordConfirm: acc.password,
                        name: acc.name,
                        role: acc.role,
                        status: 'active'
                    });
                    console.log(`Created ${acc.email}`);
                } else {
                    console.log(`Account ${acc.email} already exists.`);
                }
            } catch (e: any) {
                console.error(`Failed to process ${acc.email}:`, e.message);
            }
        }

    } catch (e: any) {
        console.error("Superuser Auth Failed:", e.message);
        // Fallback: Try creating initial superuser if totally empty? (Usually can't via API without args, but let's assume superuser exists as I verified it in browser)
    }
}

main();
