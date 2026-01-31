
import PocketBase from 'pocketbase';

// 配置
const PB_URL = 'http://127.0.0.1:8090'; // 确保 PocketBase 正在通过 Docker 或本地运行
const ADMIN_EMAIL = '86152@tongxy.xyz';
const ADMIN_PASS = '1234567890'; // 如果这不对，可能需要临时创建一个 superuser 或使用已知的凭据

const pb = new PocketBase(PB_URL);

async function main() {
    console.log("🚀 开始自动化验证脚本 (Activity & Status Check)...\n");

    try {
        // ==========================================
        // 1. 验证 Admin: 活动管理 (Activity Management)
        // ==========================================
        console.log("--- 1. 验证活动管理 (Admin: Activity Management) ---");

        // 1.1 登录
        console.log("正在以管理员身份登录...");
        try {
            await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASS);
        } catch (e) {
            // 兼容 v0.23+ 
            await pb.collection('_superusers').authWithPassword(ADMIN_EMAIL, ADMIN_PASS);
        }
        console.log("✅ 管理员登录成功。");

        // 1.2 创建活动
        const activityTitle = `自动化测试活动 ${new Date().toISOString()}`;
        console.log(`正在创建活动: "${activityTitle}"...`);

        const newActivity = await pb.collection('activities').create({
            title: activityTitle,
            category: 'other',
            status: 'planning',
            start_time: new Date().toISOString(),
            // summary: '这是一个由脚本自动创建的测试活动。',
        });
        console.log(`✅ 活动创建成功 (ID: ${newActivity.id})。`);

        // 1.3 验证列表 (查询)
        console.log("正在查询活动列表以验证...");
        const list = await pb.collection('activities').getList(1, 10, {
            filter: `id="${newActivity.id}"`
        });

        if (list.items.length > 0 && list.items[0].title === activityTitle) {
            console.log("✅ 验证成功：新创建的活动存在于列表中。");
        } else {
            console.error("❌ 验证失败：无法在列表中找到新创建的活动。");
        }

        // ==========================================
        // 2. 验证 Public: 申请进度查询 (Status Check)
        // ==========================================
        console.log("\n--- 2. 验证申请进度查询 (Public: Status Check) ---");

        // 进度查询不仅依赖数据，还依赖于“数据层”的逻辑。
        // Next.js 的 Server Action 本质上是运行在服务端的。
        // 我们在这里模拟 Server Action 的核心查询逻辑：
        // 逻辑：在 'beneficiaries' 表中查找 phone = 目标号码

        const targetPhone = "13800000000"; // 之前 seed 过的号码
        console.log(`正在模拟用户查询手机号: ${targetPhone}...`);

        // 模拟 Admin Proxy 查询 (因为 Beneficiaries 表通常不对外公开，Status Check 是通过 Admin 权限的 API Proxy 进行的)
        // 脚本当前已拥有 Admin 权限，符合 Server Action 的运行环境（它在服务器端运行，拥有特权或特定权限）

        const result = await pb.collection('beneficiaries').getFirstListItem(`phone="${targetPhone}"`);

        if (result) {
            console.log(`✅ 查询成功！找到记录:`);
            console.log(`   - 姓名: ${result.name}`);
            console.log(`   - 状态: ${result.status}`);
            console.log(`   - 类型: ${result.type}`);

            if (result.name === 'Test Beneficiary') {
                console.log("✅ 数据匹配预期。");
            } else {
                console.warn("⚠️ 数据名称与预期不符 (预期: Test Beneficiary)。");
            }
        } else {
            console.error("❌ 查询失败：未找到该手机号的记录。");
        }

        // ==========================================
        // 清理 (Optional)
        // ==========================================
        console.log("\n--- 清理测试数据 ---");
        await pb.collection('activities').delete(newActivity.id);
        console.log(`✅ 测试活动已删除 (ID: ${newActivity.id})。`);

        console.log("\n🎉 所有验证步骤已完成！");

    } catch (e: any) {
        console.error("\n❌ 脚本执行出错:", e.originalError || e.message || e);
        process.exit(1);
    }
}

main();
