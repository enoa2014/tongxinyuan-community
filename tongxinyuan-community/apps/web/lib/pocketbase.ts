
import PocketBase from 'pocketbase';

import type { TypedPocketBase } from '../types/pocketbase-types';

// Determine the URL based on environment
// For SSR (server-side), we use 127.0.0.1:8090
// For Client-side, we use relative URL to leverage Next.js Proxy (avoids CORS)
// Server-side (SSR) still needs full URL if logic runs there (but pages router might need conditional)
// Since we mainly use this in Client Components (useEffect), relative path is safest for Dev.
const PB_URL = typeof window !== 'undefined'
    ? (process.env.NEXT_PUBLIC_API_URL || '/api/pb') // Client side
    : (process.env.PB_URL || 'http://127.0.0.1:8091'); // Server side (Docker internal)

// Create a singleton instance with Type Support
export const pb = new PocketBase(PB_URL) as TypedPocketBase;

// Auto-cancellation (optional, prevents duplicate requests)
pb.autoCancellation(false);

// Global Error Logging Hook (Optimization Phase 9)
pb.afterSend = function (response, data) {
    if (response.status >= 400) {
        console.group(`🚨 PB Error: ${response.status} ${response.url}`);
        console.error('Message:', data?.message || response.statusText);
        if (data?.data && Object.keys(data.data).length > 0) {
            console.table(data.data); // Show field validation errors clearly
            console.log('Raw Data:', data.data);
        }
        console.groupEnd();
    }
    return data;
};

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
