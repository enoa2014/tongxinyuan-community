
async function main() {
    console.log("🔍 Debugging Proxy Query Params...");

    const cases = [
        { name: "Normal Sort", param: "sort=-created" },
        { name: "Encoded Sort", param: "sort=%2Dcreated" },
        { name: "Positive Sort", param: "sort=created" }, // No hyphen
        { name: "Filter Param", param: "filter=created>''" },
        { name: "Complex Filter", param: "filter=created>'2024-01-01'" },
    ];

    for (const c of cases) {
        const url = `http://localhost:3000/api/pb/api/collections/volunteer_applications/records?page=1&perPage=1&${c.param}`;
        console.log(`\n🧪 Testing: ${c.name}`);
        console.log(`   URL: ${url}`);
        try {
            const res = await fetch(url);
            console.log(`   Status: ${res.status}`);
            if (res.status !== 200 && res.status !== 403) {
                const text = await res.text();
                console.log(`   Error Body: ${text.substring(0, 200)}`);
            }
        } catch (e) {
            console.error("   ❌ Network Error", e);
        }
    }
}

main();
