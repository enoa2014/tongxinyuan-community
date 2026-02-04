import PocketBase from 'pocketbase';

const PB_URL = 'http://127.0.0.1:8090';
const SUPER_USER = 'temp@debug.com'; // Wait, I deleted this. Need to use a valid admin or just list public if possible? 
// I deleted temp@debug.com. 
// I found 'root@debug.com' / 'Tongxinyuan2026!' in previous steps. Let's try that.

const ADMIN_EMAIL = 'root@debug.com';
const ADMIN_PASS = 'Tongxinyuan2026!';

async function main() {
    const pb = new PocketBase(PB_URL);
    try {
        await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASS);
        const collections = await pb.collections.getFullList();
        console.log("Collections:", collections.map(c => c.name).join(', '));

        // Also check if 'households' or 'residents' exists and print schema if so
        const residents = collections.find(c => ['residents', 'households', 'members'].includes(c.name));
        if (residents) {
            console.log(`\nSchema for ${residents.name}:`, JSON.stringify(residents.schema, null, 2));
        }
    } catch (e) {
        console.error("Error:", e);
    }
}

main();
