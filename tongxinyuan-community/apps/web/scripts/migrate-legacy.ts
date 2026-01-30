
import fs from 'fs';
import path from 'path';
import PocketBase from 'pocketbase';
// Remove formdata-node imports
// Native FormData is available in Node 18+

// Configuration
const REQUIRED_ENV_VARS = ['PB_URL', 'PB_EMAIL', 'PB_PASSWORD', 'LEGACY_SQL_PATH', 'LEGACY_STATICS_ROOT'];
const CONFIG = {
    PB_URL: 'http://127.0.0.1:8090',
    PB_EMAIL: '86152@tongxy.xyz',
    PB_PASSWORD: '1234567890',
    LEGACY_SQL_PATH: String.raw`c:\Users\86152\work\2026\tongxy\res\txy2020\db_dump.sql`,
    LEGACY_STATICS_ROOT: String.raw`c:\Users\86152\work\2026\tongxy\res\txy2020\statics`,
};

// Category Mapping
const CATEGORY_MAP: Record<number, string> = {
    30: 'news',     // 机构动态
    31: 'news',     // 媒体报道
    33: 'notice',   // 全职招聘
    34: 'notice',   // 志愿者招募
    16: 'story',    // 项目点 -> Story?
    15: 'story',    // 项目介绍 -> Story
    // Others
    17: 'notice',   // 联系我们 -> Notice
    35: 'notice',   // 我要捐款 -> Notice
    36: 'notice',   // 合作伙伴 -> Notice
};

// Simple SQL Value Parser
function parseSqlValues(sql: string): any[][] {
    const rows: any[][] = [];
    const insertRegex = /INSERT INTO `txy_articles` .*? VALUES\s*(.*);/g;
    let match;

    while ((match = insertRegex.exec(sql)) !== null) {
        // The values string might allow multiple tuples: (..), (..)
        // But the dump seems to have one INSERT per line.
        const valueStr = match[1];

        // Parse the (val1, val2...) string safely
        const values = parseTuple(valueStr);
        if (values) {
            rows.push(values);
        }
    }
    return rows;
}

function parseTuple(str: string): string[] {
    // Remove outer parens
    str = str.trim();
    if (str.startsWith('(') && str.endsWith(')')) {
        str = str.substring(1, str.length - 1);
    }

    const result: string[] = [];
    let current = '';
    let inQuote = false;
    let escape = false;

    for (let i = 0; i < str.length; i++) {
        const char = str[i];

        if (escape) {
            current += char;
            escape = false;
            continue;
        }

        if (char === '\\') {
            escape = true; // Next char is escaped (e.g. \' )
            // But if we are in SQL string, backslash is usually literal unless escaping the quote or another backslash
            // In MySQL dump, ' is escaped as \'.
            continue;
        }

        if (char === "'" && !escape) {
            inQuote = !inQuote;
            continue;
        }

        if (char === ',' && !inQuote) {
            result.push(current);
            current = '';
            continue;
        }

        current += char;
    }
    result.push(current);

    // Clean up result (nulls, numbers still strings)
    // The parser accumulates everything. 
    // Note: The crude parser above eats the backslash. MySQL dump logic: \' -> '.
    return result;
}

const pb = new PocketBase(CONFIG.PB_URL);

async function main() {
    console.log('🚀 Starting Legacy News Migration...');

    // 1. Authenticate
    try {
        await pb.admins.authWithPassword(CONFIG.PB_EMAIL, CONFIG.PB_PASSWORD);
        console.log('✅ Authenticated as Admin');
    } catch (e) {
        console.error('❌ Authentication failed:', e);
        return;
    }

    // 2. Read SQL
    if (!fs.existsSync(CONFIG.LEGACY_SQL_PATH)) {
        console.error('❌ SQL file not found:', CONFIG.LEGACY_SQL_PATH);
        return;
    }
    const sqlContent = fs.readFileSync(CONFIG.LEGACY_SQL_PATH, 'utf-8');
    const rows = parseSqlValues(sqlContent);
    console.log(`📊 Found ${rows.length} articles to migrate.`);

    // 3. Migrate
    for (const row of rows) {
        // Schema:
        // 0: article_id
        // 1: article_cate
        // 2: article_title
        // 3: article_keywords
        // 4: article_description
        // 5: article_content
        // 6: article_img_url (e.g. 'statics/images/...')
        // 7: article_view_number
        // 8: article_create_date (timestamp)
        // 9: article_user_id
        // 10: article_from (author)
        // 11: article_status

        const id = row[0];
        const cateId = parseInt(row[1]);
        const title = row[2];
        const description = row[4];
        let content = row[5];
        const imgUrl = row[6];
        const createTime = parseInt(row[8]); // Unix timestamp (seconds)
        const author = row[10] || '同心源';

        const category = CATEGORY_MAP[cateId] || 'news';

        console.log(`\nProcessing [${id}] ${title} (Cat: ${cateId}->${category})...`);

        // Check duplicates? ID is different in PB. Title check?
        // We will just insert.

        // Fix Content Images
        // Replace 'http://www.gxtxy.org/statics' -> '/statics'
        // Replace 'http://a1.test/statics' -> '/statics'
        // Replace '/statics' -> '/statics' 
        content = content.replace(/http:\/\/www\.gxtxy\.org\/statics/g, '/statics');
        content = content.replace(/http:\/\/a1\.test\/statics/g, '/statics');

        // Prepare Data
        const formData = new FormData();
        formData.append('title', title);

        // Generate Slug (Simple fallback)
        const slug = `legacy-${id}-${Math.floor(Math.random() * 1000)}`;
        formData.append('slug', slug);

        formData.append('category', category);
        formData.append('description', description);
        formData.append('content', content);
        formData.append('author', author);
        formData.append('published', 'true'); // Must be string for FormData

        // Date
        const date = new Date(createTime * 1000);
        formData.append('created', date.toISOString());
        formData.append('updated', date.toISOString()); // Preserve update time same as create for now

        // Cover Image
        if (imgUrl && imgUrl !== 'null' && imgUrl.length > 0) {
            // imgUrl might be 'statics/images/...' or full url
            let relativePath = imgUrl;
            if (imgUrl.startsWith('http')) {
                // Try to extract relative path after 'statics/'
                const match = imgUrl.match(/statics\/(.*)/);
                if (match) {
                    relativePath = 'statics/' + match[1];
                }
            }

            // Remove leading slash if any
            if (relativePath.startsWith('/')) relativePath = relativePath.substring(1);

            // Construct local path
            // LEGACY_STATICS_ROOT points to .../txy2020/statics
            // relativePath is usually statics/images/...
            // Wait, if LEGACY_STATICS_ROOT is ends with 'statics', and relativePath starts with 'statics/', 
            // result would be .../statics/statics/... which is wrong.
            // Let's resolve carefully.

            let localFile = '';

            if (relativePath.startsWith('statics/')) {
                // The relative path includes 'statics/'.
                // If root is .../txy2020/statics, we should look for .../txy2020/statics/images/... 
                // relativePath: 'statics/images/...'
                // We need to strip 'statics/' from relativePath?
                // Or, if LEGACY_STATICS_ROOT is '.../txy2020', then join(root, relativePath).
                // User Config: LEGACY_STATICS_ROOT = .../txy2020/statics
                // We should assume relativePath is relative to the PROJECT ROOT?
                // The dump has 'statics/images/...'.
                // So if I have .../txy2020/statics, the file is at .../txy2020/statics/images/...
                // So I need to strip 'statics/' prefix from relativePath.

                const stripped = relativePath.replace(/^statics\//, ''); // 'images/...'
                localFile = path.join(CONFIG.LEGACY_STATICS_ROOT, stripped);
            } else {
                // Unexpected format, try direct join
                localFile = path.join(CONFIG.LEGACY_STATICS_ROOT, '..', relativePath);
            }

            if (fs.existsSync(localFile)) {
                try {
                    // Use Node.js native openAsBlob
                    // @ts-ignore
                    const blob = await fs.openAsBlob(localFile);
                    formData.append('cover', blob, path.basename(localFile));
                    console.log(`  📎 Attached cover: ${imgUrl} -> ${localFile}`);
                } catch (err) {
                    console.warn(`  ⚠️ Failed to read file ${localFile}:`, err);
                }
            } else {
                console.warn(`  ⚠️ Cover file not found locally: ${localFile} (Original: ${imgUrl})`);
            }
        }

        // Send to PB
        try {
            const record = await pb.collection('news').create(formData);
            console.log(`  ✅ Created: ${record.id}`);
        } catch (err: any) {
            console.error(`  ❌ Failed to create record:`, err.response?.data || err.message);
        }
    }

    console.log('🎉 Migration Complete!');
}

main().catch(console.error);
