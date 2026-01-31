
// Standalone script to upgrade Schema to V2.2 (Corrected Flattened Structure & Type Handling)
const PB_URL = process.env.NEXT_PUBLIC_PB_URL || "http://127.0.0.1:8090";
const EMAIL = process.env.PB_ADMIN_EMAIL || "86152@tongxy.xyz";
const PASSWORD = process.env.PB_ADMIN_PASSWORD || "1234567890";

async function main() {
    console.log("🚀 Starting Schema V2.2 Upgrade (Flattened + Type Fix)...");

    // 1. Authenticate
    const authRes = await fetch(`${PB_URL}/api/collections/_superusers/auth-with-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identity: EMAIL, password: PASSWORD }),
    });

    if (!authRes.ok) throw new Error("Authentication failed");
    const { token } = await authRes.json();
    const headers = { "Authorization": token, "Content-Type": "application/json" };

    // Helper to merge fields
    function mergeFields(existingFields: any[], newFields: any[]) {
        const result = [...existingFields];
        for (const nf of newFields) {
            const idx = result.findIndex(f => f.name === nf.name);
            if (idx !== -1) {
                // If type is different, we must recreate the field (drop ID)
                if (result[idx].type !== nf.type) {
                    result[idx] = { ...nf };
                } else {
                    // Merge properties, newer overwrites
                    result[idx] = { ...result[idx], ...nf };
                }
            } else {
                result.push(nf);
            }
        }
        return result;
    }

    // ==========================================
    // 2. Upgrade 'beneficiaries'
    // ==========================================
    try {
        console.log("📦 Upgrading 'beneficiaries'...");
        const benRes = await fetch(`${PB_URL}/api/collections/beneficiaries`, { headers });
        if (!benRes.ok) throw new Error("Beneficiaries collection not found");
        const benData = await benRes.json();

        const benUpdates = [
            // --- Identity ---
            { name: "name", type: "text", required: true },
            { name: "gender", type: "select", maxSelect: 1, values: ["男", "女"] },
            { name: "birth_date", type: "date" },
            { name: "id_card", type: "text" },
            { name: "hometown", type: "text" },
            { name: "phone", type: "text" },

            // --- Medical ---
            { name: "diagnosis", type: "text" },
            { name: "hospital", type: "text" },
            { name: "treatment_stage", type: "select", maxSelect: 1, values: ["initial", "chemo", "transplant", "rehab", "palliative"] },

            // --- Family (Genogram Support) ---
            { name: "guardian_name", type: "text" },
            { name: "guardian_phone", type: "text" },
            { name: "guardian_relation", type: "text" },
            { name: "family_members", type: "json" },

            // --- Privacy & Media ---
            { name: "photo_usage_consent", type: "bool" },
            { name: "photos", type: "file", maxSelect: 20, mimeTypes: ["image/jpeg", "image/png", "image/webp"] },
            { name: "documents", type: "file", maxSelect: 10 },

            // --- Classification ---
            { name: "status", type: "select", maxSelect: 1, values: ["active", "archived"] },
            { name: "type", type: "select", maxSelect: 1, values: ["illness_child", "girl_student", "other"] }
        ];

        const finalBenFields = mergeFields(benData.fields, benUpdates);

        const updateRes = await fetch(`${PB_URL}/api/collections/beneficiaries`, {
            method: "PATCH", headers, body: JSON.stringify({ fields: finalBenFields })
        });

        if (!updateRes.ok) {
            console.error("❌ Failed update beneficiaries:", await updateRes.text());
        } else {
            console.log("✅ 'beneficiaries' upgraded.");
        }

    } catch (e) {
        console.error("❌ Failed 'beneficiaries':", e);
    }

    // ==========================================
    // 3. Manage 'accommodation_units'
    // ==========================================
    let unitId = "";
    try {
        console.log("🏨 Checking 'accommodation_units'...");
        try {
            const check = await fetch(`${PB_URL}/api/collections/accommodation_units`, { headers });
            if (check.ok) {
                const data = await check.json();
                unitId = data.id;
                console.log(`ℹ️ 'accommodation_units' exists. ID: ${unitId}`);
            }
        } catch { }

        const unitFields = [
            { name: "name", type: "text", required: true },
            { name: "type", type: "select", required: true, maxSelect: 1, values: ["building", "floor", "room", "bed"] },
            { name: "status", type: "select", maxSelect: 1, values: ["active", "maintenance", "occupied"] },
            { name: "capacity", type: "number" },
            { name: "tags", type: "text" }
        ];

        if (!unitId) {
            // Create
            const schema = {
                name: "accommodation_units",
                type: "base",
                listRule: "@request.auth.id != ''",
                viewRule: "@request.auth.id != ''",
                createRule: "@request.auth.id != ''",
                updateRule: "@request.auth.id != ''",
                fields: unitFields
            };
            const res = await fetch(`${PB_URL}/api/collections`, { method: "POST", headers, body: JSON.stringify(schema) });
            if (!res.ok) throw new Error(await res.text());
            const data = await res.json();
            unitId = data.id;
            console.log("✅ 'accommodation_units' created.");

            // Add self-relation
            const parentField = { name: "parent", type: "relation", collectionId: unitId, cascadeDelete: false, maxSelect: 1 };
            const newFields = [...data.fields, parentField];
            await fetch(`${PB_URL}/api/collections/accommodation_units`, { method: "PATCH", headers, body: JSON.stringify({ fields: newFields }) });
            console.log("✅ 'accommodation_units' added self-relation.");

        } else {
            // Update
            const check = await fetch(`${PB_URL}/api/collections/accommodation_units`, { headers });
            const data = await check.json();
            const parentField = { name: "parent", type: "relation", collectionId: unitId, cascadeDelete: false, maxSelect: 1 };
            const allFields = mergeFields(data.fields, [...unitFields, parentField]);

            await fetch(`${PB_URL}/api/collections/accommodation_units`, { method: "PATCH", headers, body: JSON.stringify({ fields: allFields }) });
            console.log("✅ 'accommodation_units' updated.");
        }

    } catch (e) {
        console.error("❌ Failed 'accommodation_units':", e);
    }

    // ==========================================
    // 4. Manage 'accommodation_records'
    // ==========================================
    try {
        console.log("📝 Managing 'accommodation_records'...");
        let exists = false;
        try {
            const check = await fetch(`${PB_URL}/api/collections/accommodation_records`, { headers });
            if (check.ok) exists = true;
        } catch { }

        const benRes = await fetch(`${PB_URL}/api/collections/beneficiaries`, { headers });
        const benId = (await benRes.json()).id;

        const recordFields = [
            { name: "beneficiary", type: "relation", required: true, collectionId: benId, cascadeDelete: true, maxSelect: 1 },
            { name: "unit", type: "relation", collectionId: unitId, cascadeDelete: false, maxSelect: 1 },
            { name: "check_in", type: "date" },
            { name: "check_out", type: "date" },
            { name: "status", type: "select", required: true, maxSelect: 1, values: ["applied", "approved", "checked_in", "checked_out", "cancelled"] },
            { name: "is_temporary_oversell", type: "bool" },
            { name: "fee_amount", type: "number" },
            { name: "is_waived", type: "bool" },
            { name: "waiver_reason", type: "text" },
            { name: "remarks", type: "editor" }
        ];

        if (!exists && unitId && benId) {
            const recordSchema = {
                name: "accommodation_records",
                type: "base",
                listRule: "@request.auth.id != ''",
                viewRule: "@request.auth.id != ''",
                createRule: "@request.auth.id != ''",
                updateRule: "@request.auth.id != ''",
                fields: recordFields
            };
            const createRes = await fetch(`${PB_URL}/api/collections`, { method: "POST", headers, body: JSON.stringify(recordSchema) });
            if (!createRes.ok) throw new Error(await createRes.text());
            console.log("✅ 'accommodation_records' created.");
        } else {
            // For simplicity, not updating records if exits, assumming structure matches.
            // Or we could run mergeFields update here too.
            console.log("ℹ️ 'accommodation_records' exists.");
        }

    } catch (e) {
        console.error("❌ Failed 'accommodation_records':", e);
    }
}

main().catch(console.error);
