
const PB_URL = 'http://127.0.0.1:8090';
const ADMIN_EMAIL = '86152@tongxy.xyz';
const ADMIN_PASS = '1234567890';

const STAFF_ROLES = {
    'admin@tongxy.xyz': { role: 'web_admin', name: '系统管理员' },
    'worker@tongxy.xyz': { role: 'social_worker', name: '一线社工' },
    'manager@tongxy.xyz': { role: 'manager', name: '机构负责人' }
};

async function main() {
    try {
        console.log("Authenticating...");
        const authRes = await fetch(`${PB_URL}/api/collections/_superusers/auth-with-password`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ identity: ADMIN_EMAIL, password: ADMIN_PASS })
        });

        if (!authRes.ok) throw new Error(await authRes.text());
        const { token } = await authRes.json();

        // 1. Fetch current schema
        console.log("Fetching staff collection...");
        const colRes = await fetch(`${PB_URL}/api/collections/staff`, {
            headers: { 'Authorization': token }
        });
        const collection = await colRes.json();

        // 2. Define missing fields
        const newFields = [
            { name: 'name', type: 'text' },
            {
                name: 'role',
                type: 'select',
                maxSelect: 1,
                values: ['social_worker', 'web_admin', 'manager']
            },
            {
                name: 'avatar',
                type: 'file',
                maxSelect: 1,
                maxSize: 5242880,
                mimeTypes: ["image/jpeg", "image/png", "image/svg+xml", "image/gif", "image/webp"]
            }
        ];

        // 3. Add fields if missing
        const currentNames = new Set(collection.fields.map(f => f.name));
        const fieldsToAdd = newFields.filter(f => !currentNames.has(f.name));

        if (fieldsToAdd.length > 0) {
            console.log("Adding fields:", fieldsToAdd.map(f => f.name));
            const updatedFields = [...collection.fields, ...fieldsToAdd];

            const updateRes = await fetch(`${PB_URL}/api/collections/staff`, {
                method: 'PATCH',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ fields: updatedFields })
            });

            if (!updateRes.ok) throw new Error(await updateRes.text());
            console.log("Schema updated.");
        } else {
            console.log("Schema already has fields.");
        }

        // 4. Update existing users
        console.log("Updating user roles...");
        const usersRes = await fetch(`${PB_URL}/api/collections/staff/records?perPage=100`, {
            headers: { 'Authorization': token }
        });
        const users = await usersRes.json();

        for (const user of users.items) {
            const config = STAFF_ROLES[user.email];
            if (config) {
                console.log(`Updating ${user.email} -> ${config.role}`);
                await fetch(`${PB_URL}/api/collections/staff/records/${user.id}`, {
                    method: 'PATCH',
                    headers: {
                        'Authorization': token,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(config)
                });
            }
        }
        console.log("Done!");

    } catch (e) {
        console.error("Error:", e);
    }
}

main();
