
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');

// Configuration
const ADMIN_EMAIL = '86152@tongxy.xyz';
const ADMIN_PASS = '1234567890';

async function main() {
    try {
        console.log("Authenticating as super-admin...");
        await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASS);
        console.log("Logged in.");

        // 1. Beneficiaries (Service Objects)
        // Polymorphic design: 'type' determines which fields in 'profile' JSON are used.
        await createCollection('beneficiaries', [
            { name: 'name', type: 'text', required: true }, // Contact person / Head of household
            { name: 'phone', type: 'text', required: true }, // Unique constraint via index
            {
                name: 'type', type: 'select', required: true, options: {
                    values: ['patient_family', 'teenage_girl', 'sexual_abuse_victim', 'palliative_care', 'public']
                }
            },
            { name: 'status', type: 'select', options: { values: ['active', 'archived', 'blacklisted'] } },

            // Core Profile Data (JSON for flexibility & polymorphism)
            // Patient Family: { patient_name, diagnosis, hospital, ... }
            // Teenage Girl: { school, grade, economic_status_raw, ... }
            { name: 'profile', type: 'json' },

            { name: 'tags', type: 'json' }, // e.g. ["urgent", "low_income"]
            { name: 'created_by', type: 'relation', collectionId: 'staff', cascadeDelete: false }, // Staff who created this
        ], {
            // RBAC Rules
            // Manager: Can view/edit all.
            // Social Worker: Can view/edit most.
            // Admin: Can view public/safe info only (Strict privacy for abuse victims).

            // For now, we use a simplified rule: Staff can access.
            // TODO: Refine for 'sexual_abuse_victim' later (requires detailed expression)
            listRule: "@request.auth.collectionName = 'staff'",
            viewRule: "@request.auth.collectionName = 'staff'",
            createRule: "@request.auth.collectionName = 'staff'",
            updateRule: "@request.auth.collectionName = 'staff'",
            deleteRule: "@request.auth.role = 'manager'", // Only manager can delete
            indexes: ["CREATE UNIQUE INDEX idx_beneficiaries_phone ON beneficiaries (phone)"]
        });

        // 2. Activities (Projects/Events)
        await createCollection('activities', [
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

            { name: 'lead_staff', type: 'relation', collectionId: 'staff' }, // Responsible person
            { name: 'summary', type: 'editor' }, // Markdown/HTML summary
            { name: 'photos', type: 'file', options: { maxSelect: 10 } },
        ], {
            listRule: "", // Public can see activities? Maybe summary. For now open.
            viewRule: "",
            createRule: "@request.auth.collectionName = 'staff'",
            updateRule: "@request.auth.collectionName = 'staff'",
            deleteRule: "@request.auth.role = 'manager'",
        });

        // 3. Activity Participations (Many-to-Many)
        // Links Volunteers/Beneficiaries to Activities
        await createCollection('activity_participations', [
            { name: 'activity', type: 'relation', collectionId: 'activities', required: true, cascadeDelete: true },

            // Participant can be a Registered Volunteer (users table) OR a Beneficiary
            // PocketBase relation can point to multiple collections? No, single collection usually.
            // WORKAROUND: We use two relation fields or a generic ID string.
            // Better: 'user' (volunteer) OR 'beneficiary' relation.
            { name: 'volunteer', type: 'relation', collectionId: 'users', options: { maxSelect: 1 } }, // Registered volunteers
            { name: 'beneficiary', type: 'relation', collectionId: 'beneficiaries', options: { maxSelect: 1 } }, // Service objects

            { name: 'role', type: 'select', options: { values: ['volunteer', 'guest', 'beneficiary'] } },

            // For Guest Volunteers (Unregistered) -> Store info in JSON
            { name: 'guest_info', type: 'json' }, // { name: "...", phone: "..." }

            { name: 'check_in_time', type: 'date' },
            { name: 'feedback', type: 'text' }, // Volunteer feedback or Beneficiary thoughts
            { name: 'service_hours', type: 'number' }, // For volunteers
        ], {
            // Simplified Rule to unblock creation. 
            // TODO: Add `|| @request.auth.id = volunteer.id` after verifying how to handle null relations safely.
            listRule: "@request.auth.collectionName = 'staff'",
            viewRule: "@request.auth.collectionName = 'staff'",
            createRule: "@request.auth.collectionName = 'staff'", // Staff checks people in
            updateRule: "@request.auth.collectionName = 'staff'",
            deleteRule: "@request.auth.collectionName = 'staff'",
        });

    } catch (e) {
        console.error("Error:", e);
    }
}

async function createCollection(name: string, fields: any[], rules: any) {
    try {
        await pb.collections.getOne(name);
        console.log(`Collection '${name}' already exists. Skipping.`);
    } catch {
        console.log(`Creating collection '${name}'...`);
        try {
            await pb.collections.create({
                name,
                type: 'base',
                fields, // FIXED: Use fields instead of schema
                ...rules
            });
            console.log(`Collection '${name}' created.`);
        } catch (err) {
            console.error(`Failed to create '${name}':`, err);
        }
    }
}

main();
