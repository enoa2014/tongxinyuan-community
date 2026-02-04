import PocketBase from 'pocketbase';

const PB_URL = 'http://127.0.0.1:8090';
const ADMIN_EMAIL = 'root@debug.com';
const ADMIN_PASS = 'Tongxinyuan2026!';

async function main() {
    const pb = new PocketBase(PB_URL);
    try {
        await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASS);
        const col = await pb.collections.getOne('drafts');
        console.log(JSON.stringify(col.fields.find(f => f.name === 'status'), null, 2));
    } catch (e) {
        console.error(e);
    }
}
main();
