"use server"

import PocketBase from 'pocketbase';

type PocketBaseErrorLike = {
    status?: number
}

function isPocketBaseError(error: unknown): error is PocketBaseErrorLike {
    return typeof error === "object" && error !== null && "status" in error
}

export async function checkApplicationStatus(phone: string) {
    const pb = new PocketBase(process.env.PB_URL || 'http://127.0.0.1:8091');

    try {
        const email = process.env.ADMIN_EMAIL || '86152@tongxy.xyz';
        const pass = process.env.ADMIN_PASS || '1234567890';

        try {
            await pb.admins.authWithPassword(email, pass);
        } catch {
            await pb.collection('_superusers').authWithPassword(email, pass);
        }

        const record = await pb.collection('beneficiaries').getFirstListItem(`phone="${phone}"`);

        return {
            success: true,
            data: {
                name: record.name,
                status: record.status || 'unknown',
                category: record.type || 'general',
            }
        };

    } catch (error: unknown) {
        if (isPocketBaseError(error) && error.status === 404) {
            return {
                success: false,
                error: "未找到该手机号的申请记录"
            };
        }

        console.error("Check Status Error:", error);
        return {
            success: false,
            error: "Status lookup is temporarily unavailable. Please try again later."
        };
    }
}
