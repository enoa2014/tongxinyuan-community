
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');
const ADMIN_EMAIL = '86152@tongxy.xyz';
const ADMIN_PASS = '1234567890';

async function main() {
    try {
        await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASS);

        let staffId = 'staff';
        try {
            const s = await pb.collections.getOne('staff');
            staffId = s.id;
        } catch {
            console.log("Staff missing, continuing anyway (might fail relation)...");
        }

        console.log("Creating activities (minimal)...");
        try {
            const col = await pb.collections.create({
                name: 'activities',
                type: 'base',
                fields: [
                    { name: 'title', type: 'text', required: true }
                ]
            });
            console.log("Activities created. ID:", col.id);

            // Update with full fields
            console.log("Updating fields...");
            col.fields.push({
                name: 'category',
                type: 'select',
                options: { values: ['home_care', 'festival', 'school_visit', 'home_visit', 'training', 'other'], maxSelect: 1 }
            });
            col.fields.push({
                name: 'status',
                type: 'select',
                options: { values: ['planning', 'recruiting', 'ongoing', 'review', 'completed'], maxSelect: 1 }
            });
            col.fields.push({ name: 'start_time', type: 'date' });
            col.fields.push({ name: 'end_time', type: 'date' });
            col.fields.push({ name: 'location', type: 'text' });
            col.fields.push({ name: 'lead_staff', type: 'relation', collectionId: staffId, options: { maxSelect: 1 } }); // relation usually allows single
            col.fields.push({ name: 'summary', type: 'editor' });
            col.fields.push({ name: 'photos', type: 'file', options: { maxSelect: 10, mimeTypes: ["image/jpeg", "image/png"], maxSize: 5242880 } });

            await pb.collections.update(col.id, col);
            console.log("Activities updated.");

        } catch (e: any) {
            console.log("Error:", JSON.stringify(e.data || e, null, 2));
        }

    } catch (e) {
        console.error(e);
    }
}
main();
