
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8090');
const ADMIN_EMAIL = '86152@tongxy.xyz';
const ADMIN_PASS = '1234567890';

// Data from services/page.tsx
const servicesData = [
    {
        title: "生活支持 (Life Support)",
        icon: "utensils", // Storing icon name string instead of React component
        description: "不仅是住宿，更是生活。我们提供爱心物资站和共享厨房，让患儿家庭能吃上热腾腾的家乡菜，降低生活成本，并在烟火气中重建社交链接。",
        color_theme: "green" // Simplified for DB storage
    },
    {
        title: "喘息服务 (Respite Services)",
        icon: "heart_handshake",
        description: "为长期照护的家长提供心理疏导与互助网络。通过社工专业陪伴和艺术疗愈，让疲惫的心灵得到片刻的休息与充电。",
        color_theme: "yellow"
    },
    {
        title: "儿童康乐 (Child Recreation)",
        icon: "book_open",
        description: "防止长期就医导致的心理发展脱轨。我们提供绘本阅读和游戏治疗，守护孩子童年的快乐与色彩。",
        color_theme: "blue"
    },
    {
        title: "生命教育 (Life Education)",
        icon: "sun",
        description: "社区化安宁疗护。与临床医疗互补，提升家庭面对生死议题的韧性，让每一个生命都得到尊严与温暖。",
        color_theme: "orange"
    }
];

async function main() {
    console.log("🚀 Initializing 'services' collection...");

    try {
        await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASS);
        console.log("✅ Auth Successful.");

        let collection;

        // Delete existing collection if it exists (to fix schema)
        try {
            // The original comment about getFirstListItem was a self-correction.
            // The actual check is `pb.collections.getOne('services')`.
            const col = await pb.collections.getOne('services');
            if (col) {
                console.log("⚠️ Deleting existing 'services' collection to apply new schema...");
                await pb.collections.delete(col.id);
            }
        } catch (e) {
            // Check flow: normal if not found
        }

        console.log("✨ Creating new 'services' collection...");
        collection = await pb.collections.create({
            name: 'services',
            type: 'base',
            fields: [
                { name: 'title', type: 'text', required: true },
                { name: 'description', type: 'text', required: true },
                { name: 'icon', type: 'text', required: true },
                { name: 'color_theme', type: 'text', required: true },
            ]
        });
        console.log("✅ Collection created.");

        // Insert data
        for (const service of servicesData) {
            await pb.collection('services').create(service);
            console.log(`   + Created: "${service.title}"`);
        }

        console.log("\n🎉 Service initialization complete!");

    } catch (e) {
        console.error("❌ Fatal Error:", e);
    }
}

main();
