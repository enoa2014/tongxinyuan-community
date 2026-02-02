
import PocketBase from 'pocketbase';

const pb = new PocketBase('http://127.0.0.1:8091');

async function seedAccommodation() {
    try {
        console.log("Authenticating as admin...");
        await pb.admins.authWithPassword('dev@admin.com', 'dev123456');

        console.log("Checking for existing units...");
        const existing = await pb.collection('accommodation_units').getList(1, 1);
        if (existing.totalItems > 0) {
            console.log("⚠️ Units already exist. Skipping seed to avoid duplicates.");
            return;
        }

        console.log("🌱 Seeding Accommodation Units...");

        // 1. Create Building
        const building = await pb.collection('accommodation_units').create({
            name: "同心源小家 A栋",
            type: "building",
            status: "active",
            tags: "Main,North"
        });
        console.log(`Created Building: ${building.name}`);

        // 2. Create Floors
        const floors = ["1F", "2F", "3F"];
        for (const floorName of floors) {
            const floor = await pb.collection('accommodation_units').create({
                name: floorName,
                type: "floor",
                status: "active",
                parent: building.id
            });
            console.log(`  Created Floor: ${floor.name}`);

            // 3. Create Rooms (3 per floor)
            for (let r = 1; r <= 3; r++) {
                const roomName = `${parseInt(floorName)}0${r}`;
                const room = await pb.collection('accommodation_units').create({
                    name: roomName,
                    type: "room",
                    status: "active",
                    parent: floor.id,
                    tags: r === 3 ? "Family Suite" : "Standard"
                });
                console.log(`    Created Room: ${room.name}`);

                // 4. Create Beds (2 per room)
                const beds = ["Bed A", "Bed B"];
                for (const bedName of beds) {
                    await pb.collection('accommodation_units').create({
                        name: `${roomName}-${bedName}`,
                        type: "bed",
                        status: "active", // Default to active
                        parent: room.id,
                        capacity: 1
                    });
                    console.log(`      Created Bed: ${bedName}`);
                }
            }
        }

        console.log("✅ Seeding Complete!");

    } catch (e) {
        console.error("❌ Seeding Failed:", e);
    }
}

seedAccommodation();
