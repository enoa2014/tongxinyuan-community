# Findings & Discoveries Logic
> **Project**: Tongxinyuan Community Platform
> **Context**: Ongoing development and legacy maintenance.

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
4. [ ] **Logs**: Use `docker logs` and `php_errors.log` immediately; don't guess.
