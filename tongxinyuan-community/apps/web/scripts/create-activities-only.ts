
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');
const ADMIN_EMAIL = '86152@tongxy.xyz';
const ADMIN_PASS = '1234567890';

async function main() {
    try {
        await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASS);

        // 1. Activities
        console.log("Creating activities...");

        // Get Staff ID
        let staffId = 'staff';
        try {
            const s = await pb.collections.getOne('staff');
            staffId = s.id;
        } catch {
            console.log("Staff collection missing! Using 'users' as fallback or failing.");
            // Falback to users?
            // staffId = 'users'; 
            throw new Error("Staff collection missing");
        }

        try {
            await pb.collections.create({
                name: 'activities',
                type: 'base',
                fields: [
                    { name: 'title', type: 'text', required: true },
                    {
                        name: 'category', type: 'select', options: {
                            values: ['home_care', 'festival', 'school_visit', 'home_visit', 'training', 'other']
                        }
                    },
                    {
                        name: 'status', type: 'select', options: {
                            values: ['planning', 'recruiting', 'ongoing', 'review', 'completed']
                        }
                    },
                    { name: 'start_time', type: 'date' },
                    { name: 'end_time', type: 'date' },
                    { name: 'location', type: 'text' },
                    { name: 'lead_staff', type: 'relation', collectionId: staffId },
                    { name: 'summary', type: 'editor' },
                    { name: 'photos', type: 'file', options: { maxSelect: 10 } },
                ],
                listRule: "",
                viewRule: "",
                createRule: "@request.auth.collectionName = 'staff'",
                updateRule: "@request.auth.collectionName = 'staff'",
                deleteRule: "@request.auth.role = 'manager'",
            });
            console.log("Activities created.");
        } catch (e: any) {
            console.log("Activities creation failed (or exists):", JSON.stringify(e.data, null, 2));
        }

        // 2. Activity Participations
        console.log("Creating activity_participations...");
        try {
            await pb.collections.create({
                name: 'activity_participations',
                type: 'base',
                fields: [
                    { name: 'activity', type: 'relation', collectionId: 'activities', required: true, cascadeDelete: true },
                    { name: 'volunteer', type: 'relation', collectionId: 'users', options: { maxSelect: 1 } },
                    // { name: 'beneficiary', type: 'relation', collectionId: 'beneficiaries', options: { maxSelect: 1 } }, // Skip for now if beneficiaries doesn't exist?
                    // Actually, if beneficiaries fails, we can't link it. 
                    // Let's Skip beneficiary link for this specific "Activity Management" task focused on Activities themselves.

                    { name: 'role', type: 'select', options: { values: ['volunteer', 'guest', 'beneficiary'] } },
                    { name: 'guest_info', type: 'json' },
                    { name: 'check_in_time', type: 'date' },
                    { name: 'feedback', type: 'text' },
                    { name: 'service_hours', type: 'number' },
                ],
                listRule: "@request.auth.collectionName = 'staff'",
                viewRule: "@request.auth.collectionName = 'staff'",
                createRule: "@request.auth.collectionName = 'staff'",
                updateRule: "@request.auth.collectionName = 'staff'",
                deleteRule: "@request.auth.collectionName = 'staff'",
            });
            console.log("Activity Participations created.");
        } catch (e: any) {
            console.log("Participations creation failed (or exists):", e.status);
        }

    } catch (e) {
        console.error(e);
    }
}
main();
