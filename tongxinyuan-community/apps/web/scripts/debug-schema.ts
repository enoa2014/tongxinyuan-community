
// Debug script to test Select field creation
const PB_URL = process.env.NEXT_PUBLIC_PB_URL || "http://127.0.0.1:8090";
const EMAIL = process.env.PB_ADMIN_EMAIL || "86152@tongxy.xyz";
const PASSWORD = process.env.PB_ADMIN_PASSWORD || "1234567890";

async function main() {
    console.log("🚀 Starting Debug Schema...");

    // 1. Authenticate
    const authRes = await fetch(`${PB_URL}/api/collections/_superusers/auth-with-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identity: EMAIL, password: PASSWORD }),
    });

    if (!authRes.ok) throw new Error("Authentication failed");
    const { token } = await authRes.json();
    const headers = { "Authorization": token, "Content-Type": "application/json" };

    // 2. Try create test collection
    const testSchema = {
        name: "debug_select_test",
        type: "base",
        fields: [
            { name: "title", type: "text" },
            {
                name: "category",
                type: "select",
                options: {
                    maxSelect: 1,
                    values: ["A", "B", "C"]
                }
            }
        ]
    };

    try {
        // Delete if exists
        try {
            const check = await fetch(`${PB_URL}/api/collections/debug_select_test`, { headers });
            if (check.ok) {
                const id = (await check.json()).id;
                await fetch(`${PB_URL}/api/collections/debug_select_test`, { method: "DELETE", headers });
                console.log("Deleted existing debug collection");
            }
        } catch { }

        console.log("Creating debug collection...");
        const res = await fetch(`${PB_URL}/api/collections`, {
            method: "POST",
            headers,
            body: JSON.stringify(testSchema)
        });

        if (!res.ok) {
            console.error("❌ Failed to create:", await res.text());
        } else {
            console.log("✅ Success! Created collection.");
            const data = await res.json();
            console.log("Fields:", JSON.stringify(data.fields, null, 2));
        }

    } catch (e) {
        console.error("Error:", e);
    }
}

main();
