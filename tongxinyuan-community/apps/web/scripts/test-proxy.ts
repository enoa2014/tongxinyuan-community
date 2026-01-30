
import { pb } from '../lib/pocketbase';

// Force usage of Proxy URL for test
pb.baseUrl = 'http://localhost:3000/api/pb';

async function main() {
    console.log("🧪 Testing Proxy Create News (POST)...");

    // Authenticate (Client side way, but using hardcoded creds for test logic?)
    // Actually we need valid auth token. 
    // Proxy forwards 'Authorization' header.
    // So we must auth against Proxy? Or auth against PB direct and use token?
    // We can auth against PB direct, get token, set it in PB instance, then change URL.

    // 1. Auth Direct
    const pbDirect = new (require('pocketbase').default)('http://127.0.0.1:8090');
    await pbDirect.admins.authWithPassword('86152@tongxy.xyz', '1234567890');
    const token = pbDirect.authStore.token;

    // 2. Setup Proxy Client
    pb.authStore.save(token, null);

    // 3. Create FormData
    // Since we are in Node, we use 'form-data' package or native FormData (Node 18+)
    const formData = new FormData();
    formData.append('title', 'Test Proxy Article');
    formData.append('slug', 'test-proxy-' + Date.now());
    formData.append('content', 'This is content');
    formData.append('category', 'news');
    formData.append('published', 'true');

    // Create a dummy file blob
    const blob = new Blob(['Hello World Image Mock'], { type: 'text/plain' });
    formData.append('cover', blob, 'test.txt');

    try {
        const result = await pb.collection('news').create(formData);
        console.log("✅ Proxy Create Success:", result.id);
    } catch (e: any) {
        console.error("❌ Proxy Create Failed!");
        console.error("   Status:", e.status);
        console.error("   Message:", e.message);
        console.error("   Response:", e.response);
    }
}

main();
