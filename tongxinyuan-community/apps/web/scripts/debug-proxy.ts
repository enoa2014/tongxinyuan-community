
async function main() {
    console.log("📡 Testing Next.js Proxy...");
    const url = "http://localhost:3000/api/pb/api/health";

    try {
        const res = await fetch(url);
        console.log(`Status: ${res.status}`);
        const text = await res.text();
        console.log(`Body: ${text}`);

        if (res.status === 200 && text.includes("code")) {
            console.log("✅ Proxy is WORKING.");
        } else {
            console.log("❌ Proxy is BROKEN/MISCONFIGURED.");
        }

        // Test List (should be 403 or 200, but not 400/404/500 if correct)
        console.log("\n📡 Testing List Records (via Proxy)...");
        const listUrl = "http://localhost:3000/api/pb/api/collections/volunteer_applications/records?page=1&perPage=5&sort=-created";
        const resList = await fetch(listUrl);
        console.log(`List Status: ${resList.status}`);
        const listText = await resList.text();
        console.log(`List Body: ${listText}`);
    } catch (e) {
        console.error("❌ Fetch Error:", e);
    }
}

main();
