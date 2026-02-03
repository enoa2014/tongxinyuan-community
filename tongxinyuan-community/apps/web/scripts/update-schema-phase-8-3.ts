
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8091');
const SUPERUSER_EMAIL = 'root@debug.com';
const SUPERUSER_PASS = 'Tongxinyuan2026!';

async function keyPress() {
    return new Promise(resolve => {
        process.stdin.setRawMode(true);
        process.stdin.resume();
        process.stdin.once('data', () => {
            process.stdin.setRawMode(false);
            resolve(void 0);
        });
    });
}

async function main() {
    try {
        console.log("Authenticating as Superuser...");
        await pb.collection('_superusers').authWithPassword(SUPERUSER_EMAIL, SUPERUSER_PASS);

        // 1. Create 'public_donations' collection
        console.log("Checking 'public_donations' collection...");
        try {
            await pb.collection('public_donations').getOne('test');
        } catch (e: any) {
            if (e.status === 404) {
                try {
                    await pb.collections.create({
                        name: 'public_donations',
                        type: 'base',
                        schema: [
                            { name: 'project_name', type: 'text', required: true, options: { min: 1 } }, // e.g., "Winter Plan"
                            { name: 'donor_name', type: 'text', required: true, options: { min: 1 } },   // e.g., "Charity Foundation"
                            { name: 'amount', type: 'text', required: true },                            // e.g., "10,000 RMB" or "50 Jackets" (Text to allow mixed content)
                            { name: 'donate_date', type: 'date', required: true },
                            { name: 'images', type: 'file', options: { maxSelect: 5, mimeTypes: ['image/*'] } },
                            { name: 'description', type: 'editor' },                                     // Detailed story if needed
                            { name: 'status', type: 'select', options: { values: ['draft', 'published'], maxSelect: 1 }, required: true }
                        ]
                    });
                    console.log("Created 'public_donations' collection.");
                } catch (createErr: any) {
                    // Check if it already exists (api error sometimes differs)
                    if (!createErr.message.includes('already exists')) {
                        console.error("Failed to create 'public_donations':", createErr);
                    } else {
                        console.log("'public_donations' likely exists.");
                    }
                }
            }
        }

        // 2. Update 'news' collection
        console.log("Updating 'news' schema...");
        try {
            const newsCollection = await pb.collections.getOne('news');
            let newsChanged = false;

            // Add 'category' if missing
            if (!newsCollection.schema.find(f => f.name === 'category')) {
                newsCollection.schema.push({
                    name: 'category',
                    type: 'select',
                    options: {
                        values: ['official', 'submission', 'media'],
                        maxSelect: 1
                    }
                });
                newsChanged = true;
            }

            // Add 'author_name' if missing
            if (!newsCollection.schema.find(f => f.name === 'author_name')) {
                newsCollection.schema.push({
                    name: 'author_name',
                    type: 'text',
                    options: {}
                });
                newsChanged = true;
            }

            if (newsChanged) {
                await pb.collections.update('news', newsCollection);
                console.log("Updated 'news' schema.");
            } else {
                console.log("'news' schema already up to date.");
            }
        } catch (e) {
            console.error("Error updating 'news':", e);
        }

        // 3. Update 'activities' collection
        console.log("Updating 'activities' schema...");
        try {
            const actCollection = await pb.collections.getOne('activities');
            let actChanged = false;

            // Add 'registration_type'
            if (!actCollection.schema.find(f => f.name === 'registration_type')) {
                actCollection.schema.push({
                    name: 'registration_type',
                    type: 'select',
                    options: {
                        values: ['internal', 'external_link', 'qrcode'],
                        maxSelect: 1
                    }
                });
                actChanged = true;
            }

            // Add 'qrcode_image'
            if (!actCollection.schema.find(f => f.name === 'qrcode_image')) {
                actCollection.schema.push({
                    name: 'qrcode_image',
                    type: 'file',
                    options: { maxSelect: 1, mimeTypes: ['image/*'] }
                });
                actChanged = true;
            }

            // Add 'external_url'
            if (!actCollection.schema.find(f => f.name === 'external_url')) {
                actCollection.schema.push({
                    name: 'external_url',
                    type: 'url',
                    options: {}
                });
                actChanged = true;
            }


            if (actChanged) {
                await pb.collections.update('activities', actCollection);
                console.log("Updated 'activities' schema.");
            } else {
                console.log("'activities' schema already up to date.");
            }
        } catch (e) {
            console.error("Error updating 'activities':", e);
        }

        console.log("Schema Update Complete.");

    } catch (e: any) {
        console.error("Script failed:", e.message);
    }
}

main();
