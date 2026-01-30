
import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // Don't cache this

const TARGET_BASE = process.env.PB_URL || "http://127.0.0.1:8090";

async function proxy(request: NextRequest, props: { params: Promise<{ path: string[] }> }) {
    // 1. Construct Target URL
    const params = await props.params;
    // params.path is ['api', 'collections', '...'] matched from /api/pb/[...path]
    const path = params.path.join("/");
    const queryString = request.nextUrl.search; // includes ?
    const targetUrl = `${TARGET_BASE}/${path}${queryString}`;

    console.log(`[Proxy Request] Path: ${path}`);
    console.log(`[Proxy Request] Target: ${targetUrl}`);

    try {
        // 2. Prepare Headers
        const headers = new Headers(request.headers);
        // Important: Host header must match the target (or be omitted so fetch sets it)
        headers.delete("host");
        headers.delete("connection");
        headers.delete("content-length"); // Let fetch calculate length from body

        // Log headers for debugging
        headers.forEach((v, k) => console.log(`[Proxy Header] ${k}: ${v}`));
        console.log(`[Proxy Auth Check] Authorization Present: ${headers.has('authorization')}`);
        console.log(`[Proxy Auth Check] Cookie Present: ${headers.has('cookie')}`);

        // Fallback: If Authorization is missing, try to get it from cookie (pb_auth)
        if (!headers.has("authorization") && headers.has("cookie")) {
            const cookies = headers.get("cookie") || "";
            const pbAuthMatch = cookies.match(/pb_auth=([^;]+)/);
            if (pbAuthMatch && pbAuthMatch[1]) {
                try {
                    const token = decodeURIComponent(pbAuthMatch[1]);
                    // PB auth cookie is usually a JSON object {token: "...", model: ...} or just "token"
                    // The SDK exportToCookie produces: pb_auth={%22token%22:%22...%22,...}

                    // It might be URL encoded JSON
                    let tokenValue = token;
                    if (token.startsWith("{") || token.startsWith("%7B")) {
                        const parsed = JSON.parse(token); // if it was already decoded? no check format
                        tokenValue = parsed.token;
                    } else {
                        // Double decode might be needed if it was %7B...
                        try {
                            const decodedTwice = decodeURIComponent(token);
                            const parsed = JSON.parse(decodedTwice);
                            tokenValue = parsed.token;
                        } catch (e) {
                            // Maybe it's just the raw token string? Unlikely with implicit export
                        }
                    }

                    if (tokenValue) {
                        headers.set("authorization", tokenValue);
                        console.log("[Proxy] Recovered Authorization from Cookie");
                    }
                } catch (e) {
                    console.log("[Proxy] Failed to parse/decode pb_auth cookie", e);
                }
            }
        }

        // 3. Forward Request
        const isMutation = request.method !== "GET" && request.method !== "HEAD";
        const body = isMutation ? await request.arrayBuffer() : undefined;

        const fetchOptions: RequestInit = {
            method: request.method,
            headers: headers,
            body: body,
        };

        const response = await fetch(targetUrl, fetchOptions);

        if (!response.ok) {
            const errorText = await response.clone().text();
            console.error(`[Proxy Error] Upstream ${response.status}: ${errorText}`);
        }

        // 4. Return Response
        // Create new headers to avoid immutable/read-only issues
        const responseHeaders = new Headers();
        response.headers.forEach((value, key) => {
            responseHeaders.set(key, value);
        });

        return new NextResponse(response.body, {
            status: response.status,
            statusText: response.statusText,
            headers: responseHeaders,
        });

    } catch (error) {
        console.error("[Proxy Error]", error);
        return NextResponse.json(
            { message: "Proxy Failed", error: String(error) },
            { status: 500 }
        );
    }
}

export { proxy as GET, proxy as POST, proxy as PUT, proxy as PATCH, proxy as DELETE };
