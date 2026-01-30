# Findings & Discoveries Logic
> **Project**: Tongxinyuan Community Platform
> **Context**: Ongoing development and legacy maintenance.

## 2026-01-30: PocketBase Integration Findings

### 1. API Collection Creation (v0.23+)
**Issue**: Creating a collection via JS SDK using `schema: [...]` resulted in an empty collection.
**Discovery**: Newer PocketBase versions have renamed `schema` to `fields` in the creation payload.
**Fix**: Updated update scripts to use `fields`.

### 2. Guest Access & Sorting
**Issue**: Public access to `services` collection worked (`listRule = ""`), but requests with `sort: 'created'` returned `400 Bad Request`.
**Diagnosis**: The error only occurred for unauthenticated (Guest) users. Authenticated admins could sort fine.
**Solution**: Removed the `sort` parameter for the public-facing page.

### 3. Windows Environment Variables (Playwright)
**Issue**: Playwright failed to launch with error `$HOME environment variable is not set`.
**Context**: On Windows, typical Linux/Node tools expect `HOME` to be set, but Windows uses `USERPROFILE`.
**Fix**: Set user-level environment variable `HOME` to `%USERPROFILE%`. Restart required.

### 4. Browser Tool Proxy Conflict (502 Error)
**Issue**: Browser component failed with `502 Bad Gateway` when connecting to CDP port (9222).
**Cause**: `HTTP_PROXY` env var was set (e.g., to `127.0.0.1:7890`), forcing localhost traffic through the proxy, which rejected CDP traffic.
**Fix**: Remove `HTTP_PROXY` and `HTTPS_PROXY` from User Environment variables. `[Environment]::SetEnvironmentVariable("HTTP_PROXY", $null, "User")`.

## 2026-01-30: Legacy Site Recovery Post-Mortem

### 1. Network & Connectivity: The "502 Bad Gateway" Loop
**Symptom**: Nginx returning 502 errors despite containers running.
**Diagnosis**:
- Nginx configuration hardcoded an upstream IP (e.g., `172.19.0.x`).
- Docker container restarts caused IP drift, making the config stale.
- Attempting to use `docker-compose` DNS (`web`) failed because the Nginx container was not strictly sharing the bridge network correctly or resolution failed.

**Solution**: **Host Mode & Port Mapping**
- Modified `docker-compose.prod.yml` to map the PHP container's port 80 to Host port `8080` (`8080:80`).
- Configured local Nginx to proxy `http://127.0.0.1:8080`.
- **Lesson**: For legacy setups, avoid relying on unstable internal container IPs. Use explicit host port mapping for reliance.

### 2. Code Integrity: The "Infinite Spinner" & "Fatal Error"
**Symptom A**: Page loads forever with a spinning animation.
- **Cause**: The preloader was an overlay HTML element (`<div id="preloader">`) defined in `header.php`. The JavaScript responsible for fading it out failed due to jQuery/dependency issues, leaving the overlay stuck.
- **Fix**: **Surgical Removal**. Deleted the preloader HTML block from `header.php`.

**Symptom B**: `Fatal error: Class 'phpGrace\caches\fileCacher' not found`.
- **Cause**:
    1. The `fileCacher.php` file was missing from the server (likely deleted during cleanup).
    2. After restoring it, the namespace was missing (`namespace phpGrace\caches;`).
    3. The framework expected a Singleton pattern (`getInstance`), which the basic class lacked.
- **Fix**: Re-implemented `fileCacher.php` with:
    - Correct Namespace: `namespace phpGrace\caches;`
    - Singleton Pattern: `private static $instance` and `public static function getInstance()`.

### 3. Database Security: Ransomware Incident
**Symptom**: Database tables missing, replaced by `RECOVER_YOUR_DATA` table.
**Cause**: The MySQL container had port `3306` exposed to the public internet (or host) with weak/default credentials (`root/root`), leading to an automated bot attack.
**Fix**:
- **Nuclear Option**: Dropped the compromised database `a1` entirely.
- **Restore**: Re-imported from a clean backup (`db_dump.sql`).
- **Prevention**: Ensure `3306` is NOT mapped to `0.0.0.0` in production unless strictly firewalled.

### 4. Data Integrity: The "Double Encoding" Mojibake (乱码)
**Symptom**: Chinese characters displayed as specific garbled text (e.g., `2024Å‘ Å“` instead of `2024年`).
**Diagnosis**:
- **Attempt 1 (Fail)**: Checked Nginx/PHP headers -> They were correct (UTF-8).
- **Attempt 2 (Fail)**: Checked `db.php` connection -> Added `charset=utf8`, title matches, but body text still garbled.
- **Attempt 3 (Success)**: **Hex Dump Analysis**.
    - Correct UTF-8 for "年" is `E5 B9 B4`.
    - Database contained `C3 A5 C2 B9 C2 B4`.
    - This proves **Double Encoding**: The original UTF-8 bytes were interpreted as Latin-1 characters by the importer, and those Latin-1 characters were then *re-encoded* into UTF-8.

**Root Cause**: The initial database import command `mysql < db_dump.sql` used the default client charset (often `latin1` in older MySQL clients), causing the corruption *during write*.

**Fix**:
1. **Re-Import Correctly**:
   ```bash
   docker exec -i txy2020-db-1 mysql -u root -proot --default-character-set=utf8 a1 < /opt/txy2020/db_dump.sql
   ```
   *Key Flag*: `--default-character-set=utf8` ensures the client treats the input file as UTF-8.

2. **Clear Application Cache**:
   The framework (`phpGrace`) cached the *corrupted* query results in `phpGrace/caches/data/`.
   Even after fixing the DB, the site showed garbage until `rm -rf /opt/txy2020/phpGrace/caches/data/*` was executed.

### Summary Checklist for Future Recovery
1. [ ] **Network**: Ensure Nginx points to a stable IP/Port.
2. [ ] **DB Import**: ALWAYS use `--default-character-set=utf8` when importing SQL dumps.
3. [ ] **Cache**: ALWAYS clear framework/file caches (`rm -rf caches/*`) after DB operations.
### 4. Logs: Use `docker logs` and `php_errors.log` immediately; don't guess.

## 2026-01-30: Next.js Auth Proxy & PocketBase SDK

### 1. API Proxy Authorization Stripping
**Issue**: Frontend calls to `/api/pb/...` were returning empty lists (`items: []`) despite valid user login.
**Diagnosis**: 
- Next.js default `fetch` or Middleware environment was not automatically forwarding the `Authorization` header from the browser request to the upstream PocketBase.
- Client-side SDK relies on the `Authorization` header, but browsers also send cookies.
**Solution**:
- Implemented **Cookie Fallback** in the Proxy (`route.ts`).
- If `Authorization` header is missing, the proxy now explicitly parses the `pb_auth` cookie and injects it as the `Authorization` header for the upstream request.

### 2. Server-Side Safety: `decodeURIComponent` Crash
**Issue**: The Proxy endpoint crashed with `500 Internal Server Error` during the cookie fallback implementation.
**Cause**: User cookies can contain malformed or non-standard encoding. Calling `decodeURIComponent()` on a raw cookie string (e.g., `pb_auth=%...`) without a `try/catch` block caused the Node.js server to throw a `URIError` and crash the request.
**Fix**: Always wrap `decodeURIComponent` in `try/catch` when processing user input or cookies.

### 3. Auth Model: `users` vs `_superusers`
**Discovery**: Admin users in PocketBase (v0.23+) belong to the system collection `_superusers`, NOT `users`. 
**Impact**: When debugging permissions, ensuring the rules allow `@request.auth.isAdmin = true` is critical. Authentication attempts must target the correct collection (`pb.collection('_superusers').authWithPassword`).
