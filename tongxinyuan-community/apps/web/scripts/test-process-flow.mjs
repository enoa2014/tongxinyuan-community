import PocketBase from 'pocketbase';

const PB_URL = 'http://127.0.0.1:8090';
const testEmail = 'tester@worker.com';
const testPass = '12345678';

async function main() {
    const pb = new PocketBase(PB_URL);
    try {
        await pb.collection('staff').authWithPassword(testEmail, testPass);

        // 1. Get Draft
        const drafts = await pb.collection('drafts').getList(1, 1, { filter: 'status="pending"' });
        if (drafts.totalItems === 0) {
            console.log("No pending drafts to process.");
            return;
        }
        const draft = drafts.items[0];
        console.log("Processing draft:", draft.id);

        // 2. Get Resident
        const residents = await pb.collection('residents').getList(1, 1, { filter: 'name="张三"' });
        if (residents.totalItems === 0) {
            console.log("Resident 张三 not found.");
            return;
        }
        const resident = residents.items[0];
        console.log("Selected resident:", resident.name, resident.id);

        // 3. Create Case Note
        const noteData = {
            resident: resident.id,
            staff: pb.authStore.model.id,
            date: new Date(),
            type: "上门探访",
            content: "Processed from draft: " + draft.content,
            source_draft: draft.id
        };
        const note = await pb.collection('case_notes').create(noteData);
        console.log("Created Case Note:", note.id);

        // 4. Update Draft
        const updatedDraft = await pb.collection('drafts').update(draft.id, {
            status: "processed"
        });
        console.log("Updated Draft Status:", updatedDraft.status);

    } catch (e) {
        console.error("Process failed:", e);
        process.exit(1);
    }
}

main();
