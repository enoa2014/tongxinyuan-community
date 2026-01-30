
import PocketBase from 'pocketbase';

// Determine the URL based on environment
// For SSR (server-side), we use 127.0.0.1:8090
// For Client-side, we use relative URL to leverage Next.js Proxy (avoids CORS)
// Server-side (SSR) still needs full URL if logic runs there (but pages router might need conditional)
// Since we mainly use this in Client Components (useEffect), relative path is safest for Dev.
const PB_URL = typeof window !== 'undefined'
    ? (process.env.NEXT_PUBLIC_API_URL || '/api/pb') // Client side
    : (process.env.PB_URL || 'http://127.0.0.1:8090'); // Server side (Docker internal)

// Create a singleton instance
export const pb = new PocketBase(PB_URL);

// Auto-cancellation (optional, prevents duplicate requests)
pb.autoCancellation(false);

// Client-side: Load auth state from cookie if validating/refreshing
if (typeof window !== 'undefined') {
    pb.authStore.loadFromCookie(document.cookie);

    // Optional: Sync back to cookie on change (to keep expiry updated)
    pb.authStore.onChange(() => {
        const cookie = pb.authStore.exportToCookie({ httpOnly: false });
        document.cookie = cookie + (cookie.includes('path=') ? '' : '; path=/');
    });
}

export default pb;
