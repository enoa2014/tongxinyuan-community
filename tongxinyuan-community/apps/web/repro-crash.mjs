async function main() {
    const cookieVal = 'pb_auth=%7B%22token%22%3A%22TEST_TOKEN%22%2C%22model%22%3A%7B%22id%22%3A%22123%22%7D%7D';
    try {
        const res = await fetch('http://localhost:3000/api/pb/api/collections/volunteer_applications/records?page=1&perPage=50', {
            headers: {
                'Cookie': cookieVal
            }
        });
        console.log("Status:", res.status);
        const text = await res.text();
        console.log("Body:", text);
    } catch (e) {
        console.error("Fetch failed:", e);
    }
}
main();
