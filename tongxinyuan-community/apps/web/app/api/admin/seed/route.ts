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

const SERVICE_TYPES = ["心理咨询", "就医指引", "经济援助", "住宿申请", "其他"];
const SERVICE_DESC = [
    "刚确诊白血病，想了解异地医保报销政策。",
    "孩子化疗期间情绪不稳定，需要心理疏导。",
    "家庭经济困难，申请紧急救助资金。",
    "下周入院复查，申请入住同心源小家。",
    "想了解造血干细胞移植的配型流程。"
];

const ACTIVITY_TITLES = ["绘画疗愈课", "生日会", "健康讲座", "手工DIY", "绘本阅读", "节日庆祝"];
const ACTIVITY_CATS = ["home_care", "festival", "school_visit", "home_visit", "training", "other"];

// --- Generators ---

function rand(arr: any[]) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function randInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function genName(gender: 'M' | 'F' = 'M', surname?: string, isTest = true) {
    const last = surname || rand(LAST_NAMES);
    const first = gender === 'M' ? rand(MALE_NAMES) : rand(FEMALE_NAMES);
    return isTest ? `[Test] ${last}${first}` : `${last}${first}`;
}

function genPhone() {
    return `13${randInt(0, 9)}${Math.floor(Math.random() * 100000000).toString().padStart(8, '0')}`;
}

// --- Main Route Handlers ---

export async function POST(request: Request) {
    try {
        const pb = await getAdminClient();
        const createdBeneficiariesData: any[] = [];
        const createdUnitIds: string[] = [];  // Track IDs for cleanup reference if needed
        const createdVolunteers: any[] = [];
        const createdActivities: any[] = [];

        // --- 1. Accommodation Units (Hierarchy) ---
        // Building -> Floor -> Room -> Bed
        console.log("Seeding: Accommodation Config...");

        // 1.1 Building
        const building = await pb.collection('accommodation_units').create({
            name: "[Test] 同心源Demo楼",
            type: "building",
            status: "active"
        });
        createdUnitIds.push(building.id);

        const beds: any[] = [];

        // 1.2 Floors (2 Floors)
        for (let f = 1; f <= 2; f++) {
            const floor = await pb.collection('accommodation_units').create({
                name: `[Test] ${f}层`,
                type: "floor",
                parent: building.id,
                status: "active"
            });
            createdUnitIds.push(floor.id);

            // 1.3 Rooms (2 Rooms per Floor)
            for (let r = 1; r <= 2; r++) {
                const roomNum = `${f}0${r}`;
                const room = await pb.collection('accommodation_units').create({
                    name: `[Test] ${roomNum}`,
                    type: "room",
                    parent: floor.id,
                    status: "active",
                    tags: "Standard"
                });
                createdUnitIds.push(room.id);

                // 1.4 Beds (2 Beds per Room)
                for (let b of ['A', 'B']) {
                    const bed = await pb.collection('accommodation_units').create({
                        name: `[Test] ${roomNum}-${b}`,
                        type: "bed",
                        parent: room.id,
                        status: "active" // Default active, will update if linked
                    });
                    createdUnitIds.push(bed.id);
                    beds.push(bed);
                }
            }
        }


        // --- 2. Beneficiaries & Families ---
        console.log("Seeding: Beneficiaries...");
        for (let i = 1; i <= 8; i++) {
            const gender = Math.random() > 0.5 ? 'M' : 'F';
            const lastName = rand(LAST_NAMES);
            const name = genName(gender, lastName); // Has [Test]
            const disease = rand(DISEASES);
            const type = Math.random() > 0.8 ? 'girl_student' : 'illness_child';
            const hometown = rand(HOMETOWNS);
            const age = randInt(2, 16);

            // Guardian
            const guardianRelation = rand(RELATIONS);
            const guardianName = guardianRelation.key === 'F' || guardianRelation.key === 'G' ? genName('M', lastName) : genName('F');
            const guardianPhone = genPhone();

            const birthDate = new Date();
            birthDate.setFullYear(birthDate.getFullYear() - age);

            const bRecord = await pb.collection('beneficiaries').create({
                name: name,
                type: type,
                phone: guardianPhone,
                id_card: `440${randInt(1000, 9999)}${birthDate.getFullYear()}0101${randInt(1000, 9999)}`,
                status: Math.random() > 0.8 ? 'archived' : 'active',
                address: hometown,
                background_note: `患者确诊${disease}。Generated Test Data.`,
                diagnosis: disease,
                gender: gender,
                birth_date: birthDate.toISOString(),
                native_place: hometown,
                guardian_name: guardianName,
                guardian_relation: guardianRelation.name,
                guardian_phone: guardianPhone
            });
            createdBeneficiariesData.push(bRecord);

            // Family Members
            await pb.collection('family_members').create({
                beneficiary: bRecord.id,
                name: guardianName,
                relation: guardianRelation.name,
                age: randInt(30, 50),
                phone: guardianPhone,
                is_guardian: true,
                is_caregiver: true
            });
            // Random extra member
            if (Math.random() > 0.5) {
                await pb.collection('family_members').create({
                    beneficiary: bRecord.id,
                    name: genName('F'),
                    relation: "奶奶",
                    age: 65,
                    is_caregiver: true
                });
            }

            // Medical Logs
            if (bRecord.status === 'active') {
                for (let k = 0; k < randInt(1, 3); k++) {
                    await pb.collection('medical_logs').create({
                        beneficiary: bRecord.id,
                        date: new Date().toISOString(),
                        hospital: rand(HOSPITALS),
                        diagnosis: disease,
                        treatment: rand(TREATMENTS)
                    });
                }
            }
        }


        // --- 3. Accommodation Records (Linking) ---
        console.log("Seeding: Linking Accommodation...");
        // Link first 4 active beneficiaries to first 4 beds
        const activeBeneficiaries = createdBeneficiariesData.filter(b => b.status === "active");
        const availableBeds = [...beds];

        for (let i = 0; i < Math.min(activeBeneficiaries.length, availableBeds.length, 4); i++) {
            const ben = activeBeneficiaries[i];
            const bed = availableBeds[i]; // Take bed

            // Create Record
            await pb.collection('accommodation_records').create({
                beneficiary: ben.id,
                unit: bed.id,
                room_number: bed.name, // Snapshot
                record_type: "Check-in",
                start_date: new Date().toISOString(),
                is_waived: true,
                notes: "Generated Test Stay"
            });

            // Update Bed Status
            await pb.collection('accommodation_units').update(bed.id, {
                status: "occupied"
            });
        }


        // --- 4. Volunteers ---
        console.log("Seeding: Volunteers...");
        for (let i = 1; i <= 5; i++) {
            const vRecord = await pb.collection('volunteer_applications').create({
                name: genName(Math.random() > 0.5 ? 'M' : 'F'),
                phone: genPhone(),
                email: `val_${randInt(1000, 9999)}@test.com`,
                status: 'pending',
                skills: JSON.stringify(["care", "teaching"]),
                motivation: 'Generated Test Volunteer.'
            });
            createdVolunteers.push(vRecord);
        }

        // --- 5. Service Consultations ---
        console.log("Seeding: Consultations...");
        for (let i = 1; i <= 6; i++) {
            await pb.collection('service_consultations').create({
                name: genName(),
                phone: genPhone(),
                service_type: rand(SERVICE_TYPES),
                description: rand(SERVICE_DESC),
                status: Math.random() > 0.7 ? "contacted" : "pending",
                created: new Date().toISOString()
            });
        }

        // --- 6. Activities & Participations ---
        console.log("Seeding: Activities...");
        // Try to get a staff user ID for lead_staff, else skip (or use arbitrary if relaxed)
        // We'll skip lead_staff if not easily available or assume optional. 
        // Based on schema `lead_staff` is relation `staff`. Maybe fallback to nothing if optional.
        // Assuming optional or we have to fetch one.
        let staffId = "";
        try {
            const staffList = await pb.collection('staff').getList(1, 1);
            if (staffList.items.length > 0) staffId = staffList.items[0].id;
        } catch (e) { }

        if (staffId) { // Only create activities if we have a staff to lead them
            for (let i = 0; i < 3; i++) {
                const title = `[Test] ${rand(ACTIVITY_TITLES)}`;
                const act = await pb.collection('activities').create({
                    title: title,
                    category: rand(ACTIVITY_CATS),
                    status: "planning",
                    start_time: new Date().toISOString(),
                    end_time: new Date(Date.now() + 3600000).toISOString(), // +1 hour
                    location: "Community Center",
                    lead_staff: staffId,
                    summary: "<p>Generated Test Activity</p>"
                });
                createdActivities.push(act);

                // Add Participants
                // 2 Volunteers
                for (let v = 0; v < 2 && v < createdVolunteers.length; v++) {
                    // volunteer collection is 'users' usually for relation, but here we created 'volunteer_applications'. 
                    // Wait, schema says `volunteer` relation to `users`. 
                    // `volunteer_applications` are applicants, not yet users. 
                    // So we cannot strictly link `volunteer_applications` to `activity_participations.volunteer` (relation to `users`).
                    // skipping actual volunteer linkage to prevent error, unless we have real users.
                }
            }
        }

        // --- 7. Staff Accounts (Ensure Existence) ---
        console.log("Seeding: Staff Accounts...");
        const staffAccounts = [
            { email: 'dev@manager.com', password: '12345678', name: 'Dev Manager', role: 'manager' },
            { email: 'dev@admin.com', password: '12345678', name: 'Dev Admin', role: 'admin' },
            { email: 'social@worker.com', password: '12345678', name: 'Social Worker', role: 'social_worker' }
        ];

        for (const acc of staffAccounts) {
            try {
                const records = await pb.collection('staff').getList(1, 1, { filter: `email = "${acc.email}"` });
                if (records.totalItems === 0) {
                    await pb.collection('staff').create({
                        email: acc.email,
                        emailVisibility: true,
                        password: acc.password,
                        passwordConfirm: acc.password,
                        name: acc.name,
                        role: acc.role,
                        status: 'active'
                    });
                }
            } catch (e) {
                // Ignore if creating fails (e.g. unique constraint race)
            }
        }

        return NextResponse.json({
            success: true,
            message: "Successfully seeded complete test dataset (incl. Staff)."
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

        const findAndDelete = async (collection: string, filter: string) => {
            try {
                const list = await pb.collection(collection).getFullList({ filter });
                if (list.length === 0) return 0;

                // Concurrent delete is faster
                await Promise.all(list.map(item => pb.collection(collection).delete(item.id)));
                return list.length;
            } catch (e: any) {
                // If collection doesn't exist or other error, just log
                console.warn(`Clean ${collection} failed: ${e.message}`);
                return 0;
            }
        };

        // 1. Delete Leafs first (Dependencies)

        // Find Test Activities to delete participations? 
        // Or just delete participations where activity.title ~ [Test] (if cascade works? usually manual in PB unless set)
        // Schema `cascadeDelete: true` on `activity` field in `activity_participations` means deleting activity deletes items.
        // So we focus on deleting the Parents.

        // 2. Main Entities

        const deletedActivities = await findAndDelete('activities', "title ~ '[Test]%'");
        const deletedConsultations = await findAndDelete('service_consultations', "name ~ '[Test]%'");
        const deletedVolunteers = await findAndDelete('volunteer_applications', "name ~ '[Test]%'");

        // Beneficiaries (Cascades Family Members? usually no, manual delete needed if no cascade)
        // Schema usually defaults to No Cascade for safety. Let's look up family members of test beneficiaries?
        // Or simpler: `family_members` don't have [Test] in name directly sometimes (generated as real names). 
        // But `beneficiary.name` has [Test].
        // We can use relational filter: `beneficiary.name ~ '[Test]%'`
        await findAndDelete('family_members', "beneficiary.name ~ '[Test]%'");
        await findAndDelete('medical_logs', "beneficiary.name ~ '[Test]%'");
        await findAndDelete('accommodation_records', "beneficiary.name ~ '[Test]%'");

        const deletedBeneficiaries = await findAndDelete('beneficiaries', "name ~ '[Test]%'");

        // Accom Units
        // Beds -> Rooms -> Floors -> Buildings (Child constraint might block parent delete)
        // Safer to delete types in order: Bed, Room, Floor, Building
        await findAndDelete('accommodation_units', "name ~ '[Test]%' && type = 'bed'");
        await findAndDelete('accommodation_units', "name ~ '[Test]%' && type = 'room'");
        await findAndDelete('accommodation_units', "name ~ '[Test]%' && type = 'floor'");
        const deletedUnits = await findAndDelete('accommodation_units', "name ~ '[Test]%' && type = 'building'");

        return NextResponse.json({
            success: true,
            message: `Deleted: ${deletedBeneficiaries} bens, ${deletedVolunteers} vols, ${deletedActivities} acts, ${deletedConsultations} consults, ${deletedUnits} buildings/floors`
        });

    } catch (error: any) {
        console.error("Clear Seed Error:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
