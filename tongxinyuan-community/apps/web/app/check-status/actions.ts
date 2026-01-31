
"use server"

import PocketBase from 'pocketbase';

export async function checkApplicationStatus(phone: string) {
    const pb = new PocketBase('http://127.0.0.1:8090');

    try {
        // Authenticate as Admin to bypass listRule (which is staff only)
        // In Prod, use env vars. For dev prototype, using known dev credentials if env missing.
        const email = process.env.ADMIN_EMAIL || '86152@tongxy.xyz';
        const pass = process.env.ADMIN_PASS || '1234567890';

        await pb.admins.authWithPassword(email, pass);

        // Filter by phone. 
        // Note: phone is unique index, so getFirstListItem is efficient.
        const record = await pb.collection('beneficiaries').getFirstListItem(`phone="${phone}"`);

        return {
            success: true,
            data: {
                name: record.name, // Maybe partial mask? e.g. "张**"
                status: record.status || 'unknown',
                category: record.category || 'general'
            }
        };

    } catch (e: any) {
        // If 404, it means not found (or no access, but we are admin)
        if (e.status === 404) {
            return {
                success: false,
                error: "未找到该手机号的申请记录"
            };
        }
        console.error("Check Status Error:", e);
        return {
            success: false,
            error: "查询服务暂时不可用，请稍后重试"
        };
    }
}
