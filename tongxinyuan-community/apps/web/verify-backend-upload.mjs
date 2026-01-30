
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://localhost:8090');

async function main() {
    try {
        console.log("Authenticating...");
        await pb.collection('_superusers').authWithPassword('temp@test.com', '1234567890');
        console.log("Authenticated.");

        // Create a dummy file
        const blob = new Blob(['test image content'], { type: 'text/plain' });
        // In Node 20+, File is available globally
        const file = new File([blob], 'test.txt', { type: 'text/plain' });

        const formData = new FormData();
        formData.append('file', file);

        console.log("Uploading file...");
        const record = await pb.collection('media').create(formData);
        console.log("Upload successful:", record.id);
        console.log("File URL:", pb.files.getUrl(record, record.file));

        // Cleanup
        await pb.collection('media').delete(record.id);
        console.log("Cleanup successful.");

    } catch (error) {
        console.error('Upload failed:', error);
        // Print detailed response if available
        if (error.response) {
            console.error('Response data:', error.response);
        }
    }
}

main();
