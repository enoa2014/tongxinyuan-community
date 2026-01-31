
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');
const ADMIN_EMAIL = '86152@tongxy.xyz';
const ADMIN_PASS = '1234567890';

async function main() {
    try {
        await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASS);

        // Delete if exists
        try {
            await pb.collections.delete('staff');
            console.log("Deleted old staff.");
        } catch { }

        console.log("Creating staff (Auth minimal)...");
        // 1. Create with minimal rules (defaults)
        const col = await pb.collections.create({
            name: 'staff',
            type: 'auth',
        });
        console.log("Staff created. ID:", col.id);

        // Remove system fields that cannot be updated/re-sent?
        // Specifically 'created', 'updated' (autodate) and maybe 'id'
        col.fields = col.fields.filter((f: any) =>
            !['id', 'created', 'updated'].includes(f.name)
        );

        // 2. Add Fields
        const fieldsToAdd = [
            { name: 'name', type: 'text' },
            {
                name: 'avatar',
                type: 'file',
                options: {
                    maxSelect: 1,
                    maxSize: 5242880, // 5MB
                    mimeTypes: ["image/jpeg", "image/png", "image/svg+xml", "image/gif", "image/webp"]
                }
            },
            {
                name: 'role',
                type: 'select',
                required: true,
                options: { maxSelect: 1, values: ['social_worker', 'web_admin', 'manager'] }
            }
        ];

        // Append to existing fields
        for (const f of fieldsToAdd) {
            col.fields.push(f);
        }

        // 3. Update Rules
        col.listRule = "id = @request.auth.id";
        col.viewRule = "id = @request.auth.id";
        col.updateRule = "id = @request.auth.id";
        // createRule default is null (public) or admin? Auth create is usually disabled for public (signup).
        // createRule = "" means disabled (admin only).
        col.createRule = null; // Let's allow public signup for testing, or null ok.
        // Actually, preventing signup: createRule = null (Admin only)
        // Wait, rule: null means "Admin only"? No.
        // API: null = admin only. Empty string = public? No.
        // Correct: null = Admin only. Empty string = ?
        // PB Docs: "If the rule is null, only admins can perform the action."
        // "If the rule is an empty string, everyone can perform the action (public)."
        // "If the rule is a non-empty expression, access is granted if true."

        // We want Admin only creation for Staff? Yes. So default null is fine.

        await pb.collections.update(col.id, col);
        console.log("Staff updated with fields and rules.");

    } catch (e: any) {
        console.error("Error:", JSON.stringify(e.data || e, null, 2));
    }
}
main();
