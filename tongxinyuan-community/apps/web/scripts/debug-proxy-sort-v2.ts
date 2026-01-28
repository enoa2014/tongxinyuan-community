
async function main() {
    console.log("🔍 Refined Debugging...");

    // Case 1: Only Page/PerPage (Numeric)
    const url1 = "http://localhost:3000/api/pb/api/collections/volunteer_applications/records?page=1&perPage=1";
    console.log(`\n1. Testing Page/PerPage ONLY: ${url1}`);
    const res1 = await fetch(url1);
    console.log(`   Status: ${res1.status}`); // Expect 403 (Admin Only) or 200. NOT 400.
    if (res1.status === 400) console.log(await res1.text());

    // Case 2: Sort Simple (Alpha only)
    const url2 = "http://localhost:3000/api/pb/api/collections/volunteer_applications/records?page=1&perPage=1&sort=created";
    console.log(`\n2. Testing Sort (Alpha): ${url2}`);
    const res2 = await fetch(url2);
    console.log(`   Status: ${res2.status}`);
    if (res2.status === 400) console.log(await res2.text());

    // Case 3: Sort Special (Hyphen)
    const url3 = "http://localhost:3000/api/pb/api/collections/volunteer_applications/records?page=1&perPage=1&sort=-created";
    console.log(`\n3. Testing Sort (Hyphen): ${url3}`);
    const res3 = await fetch(url3);
    console.log(`   Status: ${res3.status}`);
    if (res3.status === 400) console.log(await res3.text());
}

main();
