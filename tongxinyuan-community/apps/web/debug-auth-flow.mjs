import PocketBase from 'pocketbase';
// import fetch from 'node-fetch'; // Built-in fetch in Node 22

const PB_URL = 'http://127.0.0.1:8090';
const PROXY_URL = 'http://localhost:3000/api/pb/api/collections/volunteer_applications/records';

async function main() {
    const pb = new PocketBase(PB_URL);

    console.log("1. Getting Valid Token...");
    try {
        await pb.collection('_superusers').authWithPassword('86152@tongxy.xyz', '1234567890');
        const token = pb.authStore.token;
        const cookie = pb.authStore.exportToCookie();
        console.log("Token obtained:", token.substring(0, 20) + "...");

        // Test 1: Direct Header
        console.log("\n2. Testing Proxy with Authorization Header...");
        try {
            const res = await fetch(PROXY_URL, {
                headers: {
                    'Authorization': token
                }
            });
            const data = await res.json();
            console.log("Header Test Result:", {
                status: res.status,
                totalItems: data.totalItems,
                isCorrect: data.totalItems > 0
            });
        } catch (e) {
            console.error("Header Test Failed:", e.message);
        }

        // Test 2: Cookie Fallback
        console.log("\n3. Testing Proxy with Cookie Fallback...");
        try {
            const res = await fetch(PROXY_URL, {
                headers: {
                    'Cookie': cookie
                }
            });
            const data = await res.json();
            console.log("Cookie Test Result:", {
                status: res.status,
                totalItems: data.totalItems,
                isCorrect: data.totalItems > 0
            });
        } catch (e) {
            console.error("Cookie Test Failed:", e.message);
        }

    } catch (e) {
        console.error("Setup Failed:", e);
    }
}

main();
