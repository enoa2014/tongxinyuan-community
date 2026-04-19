
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8091');

async function checkAndCreateSchemas() {
    try {
        console.log("Authenticating as admin...");
        await pb.admins.authWithPassword('dev@admin.com', 'dev123456');

        // Check/Create beneficiary_media
        try {
            await pb.collections.getOne('beneficiary_media');
            console.log("✅ Collection 'beneficiary_media' exists.");
        } catch (e: any) {
            if (e.status === 404) {
                console.log("⚠️ Collection 'beneficiary_media' missing. Creating...");
                const beneficiaries = await pb.collections.getOne('beneficiaries');
                await pb.collections.create({
                    name: 'beneficiary_media',
                    type: 'base',
                    fields: [
                        { name: 'beneficiary', type: 'relation', required: true, collectionId: beneficiaries.id, maxSelect: 1, cascadeDelete: true },
                        { name: 'file', type: 'file', required: true, maxSelect: 1, maxSize: 5242880, mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'] },
                        { name: 'caption', type: 'text' },
                        { name: 'category', type: 'select', values: ["Life", "Medical", "Document", "Other"] },
                        { name: 'is_public', type: 'bool' },
                        { name: 'captured_date', type: 'date' }
                    ]
                });
                console.log("✅ Collection 'beneficiary_media' created.");
            } else {
                console.error("Error checking beneficiary_media:", e.originalError || e);
            }
        }

        // Check/Create accommodation_units
        try {
            await pb.collections.getOne('accommodation_units');
            console.log("✅ Collection 'accommodation_units' exists.");
        } catch (e: any) {
            if (e.status === 404) {
                console.log("⚠️ Collection 'accommodation_units' missing. Creating...");
                await pb.collections.create({
                    name: 'accommodation_units',
                    type: 'base',
                    fields: [
                        { name: 'name', type: 'text', required: true },
                        { name: 'type', type: 'select', values: ["building", "floor", "room", "bed"], required: true },
                        { name: 'status', type: 'select', values: ["active", "maintenance", "occupied"] },
                        { name: 'parent', type: 'relation', collectionId: 'accommodation_units', maxSelect: 1, cascadeDelete: false }, // Self-relation (e.g. Room -> Floor)
                        { name: 'capacity', type: 'number' },
                        { name: 'tags', type: 'text' }
                    ]
                });
                console.log("✅ Collection 'accommodation_units' created.");
            }
        }

        // Check/Create accommodation_records
        try {
            await pb.collections.getOne('accommodation_records');
            console.log("✅ Collection 'accommodation_records' exists.");

            // Check if 'unit' field exists (migration for existing collection)
            // Check if 'unit' field exists (migration for existing collection)
            const collection = await pb.collections.getOne('accommodation_records');
            // In v0.23+, schema is moved to fields
            const fields = collection.fields || collection.schema || [];
            const unitField = fields.find((f: any) => f.name === 'unit');
            const feeField = fields.find((f: any) => f.name === 'fee_amount');
            const paymentStatusField = fields.find((f: any) => f.name === 'payment_status');
            const waiverReasonField = fields.find((f: any) => f.name === 'waiver_reason');
            const missingFields = [];

            if (!unitField) {
                console.log("⚠️ Field 'unit' missing in 'accommodation_records'. Adding...");
                const units = await pb.collections.getOne('accommodation_units');
                missingFields.push({ name: 'unit', type: 'relation', required: true, collectionId: units.id, maxSelect: 1, cascadeDelete: false });
            }

            if (!feeField) {
                console.log("⚠️ Field 'fee_amount' missing in 'accommodation_records'. Adding...");
                missingFields.push({ name: 'fee_amount', type: 'number' });
            }

            if (!paymentStatusField) {
                console.log("⚠️ Field 'payment_status' missing in 'accommodation_records'. Adding...");
                missingFields.push({ name: 'payment_status', type: 'select', values: ["pending", "paid", "waived"] });
            }

            if (!waiverReasonField) {
                console.log("⚠️ Field 'waiver_reason' missing in 'accommodation_records'. Adding...");
                missingFields.push({ name: 'waiver_reason', type: 'text' });
            }

            if (missingFields.length > 0) {
                await pb.collections.update(collection.id, {
                    fields: [
                        ...fields,
                        ...missingFields,
                    ]
                });
                console.log("✅ Missing finance fields added to 'accommodation_records'.");
            }

        } catch (e: any) {
            if (e.status === 404) {
                console.log("⚠️ Collection 'accommodation_records' missing. Creating...");
                const beneficiaries = await pb.collections.getOne('beneficiaries');
                const units = await pb.collections.getOne('accommodation_units');

                await pb.collections.create({
                    name: 'accommodation_records',
                    type: 'base',
                    fields: [
                        { name: 'beneficiary', type: 'relation', required: true, collectionId: beneficiaries.id, maxSelect: 1, cascadeDelete: true },
                        { name: 'unit', type: 'relation', required: true, collectionId: units.id, maxSelect: 1, cascadeDelete: false },
                        { name: 'start_date', type: 'date', required: true },
                        { name: 'end_date', type: 'date' },
                        { name: 'record_type', type: 'select', values: ["Check-in", "Extension", "Check-out", "Transfer"], required: true },
                        { name: 'room_number', type: 'text' }, // Verify deprecation or keep for snapshot
                        { name: 'fee_amount', type: 'number' },
                        { name: 'payment_status', type: 'select', values: ["pending", "paid", "waived"] },
                        { name: 'waiver_reason', type: 'text' },
                        { name: 'notes', type: 'text' }
                    ]
                });
                console.log("✅ Collection 'accommodation_records' created.");
            } else {
                console.error("Error checking activity_participations:", e.originalError || e);
            }
        }

    } catch (e: any) {
        console.error("Fatal Error:", e);
    }
}

checkAndCreateSchemas();
