import { NextResponse } from "next/server";
import PocketBase from "pocketbase";

// Use server-side PB instance
const PB_URL = process.env.NEXT_PUBLIC_PB_URL || "http://127.0.0.1:8091";
const ADMIN_EMAIL = process.env.PB_ADMIN_EMAIL || "root@debug.com";
const ADMIN_PASS = process.env.PB_ADMIN_PASS || "Tongxinyuan2026!";

async function getAdminClient() {
    const pb = new PocketBase(PB_URL);
    pb.autoCancellation(false);
    await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASS);
    return pb;
}

const PROJECTS = ["小白合唱团", "同心源小家", "大病患儿救助", "志愿者培训", "节日圆梦计划"];
const DONORS = ["张三", "李四", "王五", "爱心人士", "匿名", "陈先生", "刘女士"];
const HEADERS = ["", "广州", "深圳", "爱心", "慈善"];
const TAILS = ["公司", "基金会", "团契", "校友会"];

function rand(arr: any[]) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function randInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function POST(request: Request) {
    try {
        const pb = await getAdminClient();
        console.log("Seeding: Public Donations...");

        for (let i = 0; i < 20; i++) {
            const isCompany = Math.random() > 0.7;
            const donor = isCompany
                ? `${rand(HEADERS)}${rand(TAILS)}`
                : `${rand(DONORS)}`;

            await pb.collection('public_donations').create({
                project_name: rand(PROJECTS),
                donor_name: `[Test] ${donor}`,
                amount: `${randInt(10, 5000)}元`,
                donate_date: new Date(Date.now() - randInt(0, 30) * 86400000).toISOString(),
                description: "Generated Test Donation",
                status: "published"
            });
        }

        return NextResponse.json({ success: true, message: "已生成 20 条捐赠数据" });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const pb = await getAdminClient();
        const list = await pb.collection('public_donations').getFullList({
            filter: "donor_name ~ '[Test]%'"
        });

        await Promise.all(list.map(item => pb.collection('public_donations').delete(item.id)));

        return NextResponse.json({ success: true, message: `已清除 ${list.length} 条捐赠数据` });
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
