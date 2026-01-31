
// Standalone script to upgrade Beneficiary Schema V2.1 (Robust Version)
const PB_URL = process.env.NEXT_PUBLIC_PB_URL || "http://127.0.0.1:8090";
const EMAIL = process.env.PB_ADMIN_EMAIL || "86152@tongxy.xyz";
const PASSWORD = process.env.PB_ADMIN_PASSWORD || "1234567890";

async function main() {
    console.log("🚀 [Retry 2] Starting Beneficiary Schema Upgrade...");

    // 1. Authenticate
    const authRes = await fetch(`${PB_URL}/api/collections/_superusers/auth-with-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identity: EMAIL, password: PASSWORD }),
    });

    if (!authRes.ok) throw new Error("Authentication failed");
    const { token } = await authRes.json();
    const headers = { "Authorization": token, "Content-Type": "application/json" };

    // 2. Fetch Beneficiaries Collection Info
    console.log("📦 Fetching 'beneficiaries' info...");
    const benRes = await fetch(`${PB_URL}/api/collections/beneficiaries`, { headers });
    if (!benRes.ok) throw new Error("Beneficiaries collection not found");
    const benData = await benRes.json();
    const benId = benData.id;
    console.log(`ℹ️ Beneficiaries ID: ${benId}`);

    // 3. Define Desired Fields for Beneficiaries
    const desiredFields = [
        // Identity
        { name: "name", type: "text", required: true },
        { name: "gender", type: "select", options: { maxSelect: 1, values: ["男", "女"] } },
        { name: "birth_date", type: "date" },
        { name: "id_card", type: "text" },
        { name: "hometown", type: "text" },
        { name: "phone", type: "text" },
        // Medical
        { name: "diagnosis", type: "text" },
        { name: "hospital", type: "text" },
        { name: "treatment_stage", type: "select", options: { maxSelect: 1, values: ["initial", "chemo", "transplant", "rehab", "palliative"] } },
        // Family
        { name: "guardian_name", type: "text" },
        { name: "guardian_phone", type: "text" },
        { name: "guardian_relation", type: "text" },
        { name: "family_members", type: "json" },
        // Needs
        { name: "status", type: "select", options: { maxSelect: 1, values: ["active", "archived"] } },
        { name: "type", type: "select", options: { maxSelect: 1, values: ["illness_child", "girl_student", "other"] } }
    ];

    // 4. Merge Fields Logic
    // Start with existing fields to preserve IDs and valid configs
    let finalFields = [...benData.fields];

    for (const desired of desiredFields) {
        const idx = finalFields.findIndex(f => f.name === desired.name);
        if (idx !== -1) {
            // Update existing field, KEEPING THE ID
            finalFields[idx] = { ...finalFields[idx], ...desired };
        } else {
            // Add new field
            finalFields.push(desired);
        }
    }

    // 5. Update Beneficiaries
    console.log("📦 Updating 'beneficiaries' fields...");
    const updateRes = await fetch(`${PB_URL}/api/collections/beneficiaries`, {
        method: "PATCH",
        headers,
        body: JSON.stringify({ fields: finalFields })
    });

    if (!updateRes.ok) {
        console.error("❌ Failed to update beneficiaries:", await updateRes.text());
    } else {
        console.log("✅ 'beneficiaries' updated successfully.");
    }

    // 6. Create or Update Accommodation Records
    console.log("🏠 managing 'accommodation_records'...");

    // Check if exists
    let accId = "";
    try {
        const accCheck = await fetch(`${PB_URL}/api/collections/accommodation_records`, { headers });
        if (accCheck.ok) {
            const accData = await accCheck.json();
            accId = accData.id;
            console.log("ℹ️ 'accommodation_records' exists.");
        }
    } catch { }

    const accSchema = {
        name: "accommodation_records",
        type: "base",
        listRule: "@request.auth.id != ''",
        viewRule: "@request.auth.id != ''",
        createRule: "@request.auth.id != ''",
        updateRule: "@request.auth.id != ''",
        deleteRule: "@request.auth.id != ''",
        fields: [
            { name: "beneficiary", type: "relation", required: true, options: { collectionId: benId, cascadeDelete: true, maxSelect: 1 } },
            { name: "check_in", type: "date", required: true },
            { name: "check_out", type: "date" },
            { name: "bed_info", type: "text" },
            { name: "remarks", type: "editor" }
        ]
    };

    if (accId) {
        // Update existing? (Maybe just ensure fields)
        console.log("ℹ️ Skipping update for existing accommodation_records (assuming it's fine or manual update needed).");
    } else {
        // Create
        const createRes = await fetch(`${PB_URL}/api/collections`, {
            method: "POST",
            headers,
            body: JSON.stringify(accSchema)
        });

        if (!createRes.ok) {
            console.error("❌ Failed to create accommodation_records:", await createRes.text());
        } else {
            console.log("✅ 'accommodation_records' created.");
        }
    }
}

main().catch(err => console.error("Fatal Error:", err));
