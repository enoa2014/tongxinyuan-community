import { NextResponse } from "next/server";
import PocketBase from "pocketbase";

// Use server-side PB instance to ensure admin rights
const PB_URL = process.env.NEXT_PUBLIC_PB_URL || "http://127.0.0.1:8091";
const ADMIN_EMAIL = process.env.PB_ADMIN_EMAIL || "root@debug.com";
const ADMIN_PASS = process.env.PB_ADMIN_PASS || "Tongxinyuan2026!";

// Helper to quickly get admin authenticated client
async function getAdminClient() {
    const pb = new PocketBase(PB_URL);
    pb.autoCancellation(false); // Disable auto-cancellation for parallel requests
    await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASS);
    return pb;
}

// --- Data Dictionaries ---

const LAST_NAMES = [
    "李", "王", "张", "刘", "陈", "杨", "赵", "黄", "周", "吴",
    "徐", "孙", "胡", "朱", "高", "林", "何", "郭", "马", "罗",
    "梁", "宋", "郑", "谢", "韩", "唐", "冯", "于", "董", "萧"
];

const MALE_NAMES = [
    "浩宇", "子轩", "浩然", "宇轩", "一诺", "梓睿", "俊熙", "子涵", "雨泽", "欣怡",
    "伟", "强", "磊", "洋", "杰", "勇", "军", "平", "明", "刚"
];

const FEMALE_NAMES = [
    "欣怡", "梓涵", "诗涵", "雨桐", "可馨", "语汐", "雨泽", "子萱", "心怡", "梦",
    "芳", "娜", "敏", "静", "艳", "丽", "娟", "秀", "兰", "梅"
];

const DISEASES = [
    "急性淋巴细胞白血病 (ALL)", "急性髓细胞白血病 (AML)", "神经母细胞瘤",
    "肾母细胞瘤", "视网膜母细胞瘤", "横纹肌肉瘤", "地中海贫血", "再生障碍性贫血"
];

const HOSPITALS = [
    "中山大学附属第一医院", "广州市妇女儿童医疗中心", "南方医科大学南方医院",
    "广东省人民医院", "中山大学孙逸仙纪念医院", "广州医科大学附属第一医院"
];

const DEPARTMENTS = ["儿童血液科", "儿童肿瘤科", "骨髓移植中心", "儿科重症监护室(PICU)"];

const TREATMENTS = [
    "<p>进行第一阶段化疗，使用长春新碱和泼尼松。</p>",
    "<p>入院进行骨髓穿刺检查，血常规显示白细胞计数偏低。</p>",
    "<p>CART细胞治疗回输第三天，观察体温变化。</p>",
    "<p>完成造血干细胞移植，转入层流仓观察。</p>",
    "<p>门诊复查，血象恢复良好，继续维持治疗。</p>"
];

const RELATIONS = [
    { key: "F", name: "父亲", ageMin: 28, ageMax: 50 },
    { key: "M", name: "母亲", ageMin: 26, ageMax: 48 },
    { key: "G", name: "奶奶", ageMin: 55, ageMax: 70 },
    { key: "G", name: "爷爷", ageMin: 55, ageMax: 75 },
    { key: "O", name: "姑姑", ageMin: 30, ageMax: 45 }
];

const OCCUPATIONS = ["工人", "农民", "个体户", "教师", "司机", "自由职业", "职员", "务农"];

const HOMETOWNS = ["广东省梅州市", "广东省茂名市", "广东省湛江市", "湖南省邵阳市", "江西省赣州市", "广西玉林市"];

// --- Generators ---

function rand(arr: any[]) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function randInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function genName(gender: 'M' | 'F' = 'M', surname?: string) {
    const last = surname || rand(LAST_NAMES);
    const first = gender === 'M' ? rand(MALE_NAMES) : rand(FEMALE_NAMES);
    return `[Test] ${last}${first}`;
}

function genPhone() {
    return `13${randInt(0, 9)}${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`;
}

export async function POST(request: Request) {
    try {
        const pb = await getAdminClient();

        // 1. Create Test Beneficiaries
        const createdBeneficiariesData = [];
        const createdRecords = [];

        for (let i = 1; i <= 10; i++) {
            const gender = Math.random() > 0.5 ? 'M' : 'F';
            const lastName = rand(LAST_NAMES);
            const name = genName(gender, lastName);
            const disease = rand(DISEASES);
            const type = Math.random() > 0.8 ? 'girl_student' : 'illness_child';
            const hometown = rand(HOMETOWNS);
            const age = randInt(2, 16);

            // Calculate birth date
            const birthDate = new Date();
            birthDate.setFullYear(birthDate.getFullYear() - age);
            birthDate.setMonth(randInt(0, 11));
            birthDate.setDate(randInt(1, 28));

            // Generate guardian info anticipation
            const guardianRelation = rand(RELATIONS);
            const guardianName = guardianRelation.key === 'F' || guardianRelation.key === 'G' ? genName('M', lastName) : genName('F');
            const guardianPhone = genPhone();

            const payload = {
                name: name,
                type: type,
                phone: guardianPhone, // Use guardian phone as main contact
                id_card: `440${randInt(1000, 9999)}${birthDate.getFullYear()}${String(birthDate.getMonth() + 1).padStart(2, '0')}${String(birthDate.getDate()).padStart(2, '0')}${randInt(1, 9)}${randInt(0, 9)}XXXX`,
                status: Math.random() > 0.8 ? 'archived' : 'active',
                address: `${hometown}${randInt(1, 99)}组`,
                background_note: `患者确诊${disease}，来自${hometown}。家庭经济困难。`,
                diagnosis: disease,
                gender: gender,
                birth_date: birthDate.toISOString(),
                native_place: hometown,
                guardian_name: guardianName,
                guardian_relation: guardianRelation.name,
                guardian_phone: guardianPhone
            };

            const record = await pb.collection('beneficiaries').create(payload);
            createdRecords.push(record);
            createdBeneficiariesData.push({ ...payload, id: record.id });
        }

        // 2. Create Sub-collections for each Beneficiary
        const subOperations = [];

        for (const b of createdBeneficiariesData) {
            const surname = b.name.replace('[Test] ', '').substring(0, 1);

            // Add PRIMARY Guardian as Family Member
            subOperations.push(pb.collection('family_members').create({
                beneficiary: b.id,
                name: b.guardian_name,
                relation: b.guardian_relation, // Fix: Use the relation name generated earlier
                age: randInt(30, 50),
                health_status: "健康",
                occupation: rand(OCCUPATIONS),
                phone: b.guardian_phone,
                is_guardian: true,
                is_caregiver: true,
                income_contribution: true
            }));

            // Family Members (2-4 additional)
            const numFamily = randInt(2, 4);
            for (let j = 0; j < numFamily; j++) {
                const rel = rand(RELATIONS);
                // Avoid duplicating primary guardian relation if possible, but keep simple
                const memName = rel.key === 'F' || rel.key === 'G' ? genName('M', surname) : genName('F');

                const isCaregiver = Math.random() > 0.7;
                const isEarner = Math.random() > 0.7;

                subOperations.push(pb.collection('family_members').create({
                    beneficiary: b.id,
                    name: memName,
                    relation: rel.name,
                    age: randInt(rel.ageMin, rel.ageMax),
                    health_status: Math.random() > 0.9 ? "患有慢性病" : "健康",
                    occupation: rand(OCCUPATIONS),
                    phone: genPhone(),
                    is_guardian: false,
                    is_caregiver: isCaregiver,
                    income_contribution: isEarner
                }));
            }

            // Medical Logs (3-5 per person)
            if (b.status === 'active') {
                const numLogs = randInt(3, 5);
                for (let k = 0; k < numLogs; k++) {
                    const date = new Date();
                    date.setDate(date.getDate() - randInt(1, 180));

                    subOperations.push(pb.collection('medical_logs').create({
                        beneficiary: b.id,
                        date: date.toISOString(),
                        hospital: rand(HOSPITALS),
                        department: rand(DEPARTMENTS),
                        diagnosis: b.diagnosis || "白血病",
                        treatment: rand(TREATMENTS)
                    }));
                }
            }
        }

        // 3. Independent Volunteers
        for (let i = 1; i <= 5; i++) {
            subOperations.push(pb.collection('volunteer_applications').create({
                name: genName(Math.random() > 0.5 ? 'M' : 'F'),
                phone: genPhone(),
                email: `vol_${Math.floor(Math.random() * 10000)}@test.com`,
                status: 'pending',
                skills: JSON.stringify(["care", "teaching"]),
                motivation: 'Generated by Realistic Seeder.'
            }));
        }

        await Promise.all(subOperations);

        return NextResponse.json({
            success: true,
            message: `Created ${createdRecords.length} beneficiaries with families/logs and 5 volunteers.`
        });

    } catch (error: any) {
        console.error("Seed Error:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}

export async function DELETE(request: Request) {
    try {
        const pb = await getAdminClient();

        // 1. Find Beneficiaries
        const beneficiaries = await pb.collection('beneficiaries').getFullList({
            filter: "name ~ '[Test]%'"
        });

        // 2. Find Volunteers
        const volunteers = await pb.collection('volunteer_applications').getFullList({
            filter: "name ~ '[Test]%'"
        });

        const deletions = [
            ...beneficiaries.map(r => pb.collection('beneficiaries').delete(r.id)),
            ...volunteers.map(r => pb.collection('volunteer_applications').delete(r.id))
        ];

        await Promise.all(deletions);

        return NextResponse.json({
            success: true,
            message: `Deleted ${deletions.length} test records.`
        });

    } catch (error: any) {
        console.error("Clear Seed Error:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
