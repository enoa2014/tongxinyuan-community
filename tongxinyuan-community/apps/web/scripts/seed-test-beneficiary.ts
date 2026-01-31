
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');
const ADMIN_EMAIL = '86152@tongxy.xyz';
const ADMIN_PASS = '1234567890';

async function main() {
    try {
        console.log("Authenticating as super-admin...");
        await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASS); // Still valid for PB < v0.23 or if collection '_superusers' auth is aliased. 
        // Note: Findings said v0.23+ uses collection('_superusers').authWithPassword... but `admins` alias usually works in JS SDK if updated. 
        // If this fails, we switch to collection('_superusers').

        // Actually, let's just try to auth directly to 'staff' to simulate a worker, or using admin to create records.
        // Creating beneficiary only requires admin rights or 'staff' rights.

        const existing = await pb.collection('beneficiaries').getList(1, 1, {
            filter: 'phone = "13800000000"'
        });

        if (existing.items.length > 0) {
            console.log("Beneficiary '13800000000' already exists.");
            return;
        }

        console.log("Creating test beneficiary...");
        await pb.collection('beneficiaries').create({
            name: 'Test Beneficiary',
            phone: '13800000000',
            type: 'patient_family',
            status: 'active',
            profile: { city: 'Beijing' },
            tags: ['test']
        });
        console.log("Created 'Test Beneficiary' (13800000000).");

    } catch (e: any) {
        // Fallback for v0.23 admin auth if the above failed
        if (e.status === 401 || e.status === 400 || e.status === 404) {
            try {
                console.log("Trying _superusers auth...");
                await pb.collection('_superusers').authWithPassword(ADMIN_EMAIL, ADMIN_PASS);
                const existing = await pb.collection('beneficiaries').getList(1, 1, {
                    filter: 'phone = "13800000000"'
                });
                if (existing.items.length === 0) {
                    await pb.collection('beneficiaries').create({
                        name: 'Test Beneficiary',
                        phone: '13800000000',
                        type: 'patient_family',
                        status: 'active',
                        profile: { city: 'Beijing' },
                        tags: ['test']
                    });
                    console.log("Created 'Test Beneficiary'.");
                }
            } catch (err) {
                console.error("Failed to create beneficiary:", err);
            }
        } else {
            console.error("Error:", e);
        }
    }
}

main();
