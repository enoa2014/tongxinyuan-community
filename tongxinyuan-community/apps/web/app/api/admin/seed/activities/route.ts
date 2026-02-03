import { NextResponse } from "next/server";
import PocketBase from "pocketbase";

const PB_URL = process.env.NEXT_PUBLIC_PB_URL || "http://127.0.0.1:8091";
const ADMIN_EMAIL = process.env.PB_ADMIN_EMAIL || "root@debug.com";
const ADMIN_PASS = process.env.PB_ADMIN_PASS || "Tongxinyuan2026!";

async function getAdminClient() {
    const pb = new PocketBase(PB_URL);
    pb.autoCancellation(false);
    await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASS);
    return pb;
}

const TITLES = ["关爱白血病儿童", "医院探访", "爱心义卖活动", "社区义诊", "亲子游园会", "绘画课堂", "周末影院"];

function rand(arr: any[]) {
    return arr[Math.floor(Math.random() * arr.length)];
}

export async function POST(request: Request) {
    try {
        const pb = await getAdminClient();
        console.log("Seeding: Public Activities...");

        const activities = [
            // Recruiting
            ...Array(3).fill(null).map((_, i) => ({
                status: "recruiting",
                start: new Date(Date.now() + 86400000 * 3).toISOString(), // +3 days
                end: new Date(Date.now() + 86400000 * 3 + 3600000).toISOString()
            })),
            // Ongoing
            ...Array(2).fill(null).map((_, i) => ({
                status: "ongoing",
                start: new Date().toISOString(),
                end: new Date(Date.now() + 3600000).toISOString()
            })),
            // Completed
            ...Array(3).fill(null).map((_, i) => ({
                status: "completed",
                start: new Date(Date.now() - 86400000 * 5).toISOString(),
                end: new Date(Date.now() - 86400000 * 5 + 3600000).toISOString()
            })),
        ];

        for (const act of activities) {
            await pb.collection('activities').create({
                title: `[Test] ${rand(TITLES)} ${Math.floor(Math.random() * 100)}`,
                category: "other",
                status: act.status,
                start_time: act.start, // Note: Schema might use 'start_time' or 'start', verified as 'start_time' in pocketbase-types.ts
                end_time: act.end,
                location: "Activity Center",
                summary: "<p>Generated Test Activity Content...</p>",
                registration_type: "offline"
            });
        }

        return NextResponse.json({ success: true, message: `已生成 ${activities.length} 条活动数据` });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const pb = await getAdminClient();
        const list = await pb.collection('activities').getFullList({
            filter: "title ~ '[Test]%'"
        });

        await Promise.all(list.map(item => pb.collection('activities').delete(item.id)));

        return NextResponse.json({ success: true, message: `已清除 ${list.length} 条活动数据` });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
