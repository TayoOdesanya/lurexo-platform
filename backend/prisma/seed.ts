import {
    PrismaClient,
    EventCategory,
    EventStatus,
    TierStatus,
    UserRole,
    UserStatus,
    ResaleCapType,
} from "@prisma/client";

const prisma = new PrismaClient();

function slugify(input: string) {
    return input
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}

async function main() {
    // 1) Ensure an organizer user exists (Event.organizerId references User.id)
    const organizerEmail = "organizer@lurexo.local";
    const organizerUsername = "dj-flex";

    const organizer = await prisma.user.upsert({
        where: { email: organizerEmail },
        update: {
            role: UserRole.ORGANIZER,
            status: UserStatus.ACTIVE,
            organizerName: "DJ Flex Promotions",
            organizerUsername,
            organizerVerified: true,
            verified: true,
            emailVerified: true,
        },
        create: {
            email: organizerEmail,
            // Dev-only seed value (replace later if needed)
            passwordHash: "dev-seed-not-a-real-hash",
            role: UserRole.ORGANIZER,
            status: UserStatus.ACTIVE,
            firstName: "Flex",
            lastName: "Organizer",
            username: organizerUsername,
            verified: true,
            emailVerified: true,
            organizerName: "DJ Flex Promotions",
            organizerUsername,
            organizerVerified: true,
        },
    });

    // Local images served by Next.js (frontend/public)
    // You will create: frontend/public/events/<organizer.id>/<filename>
    const organizerFolder = `/events/${organizer.id}`;

    const images = {
        wintersHero: `${organizerFolder}/winters-festival.jpg`,
        rooftopHero: `${organizerFolder}/rooftop-party.jpg`,
        crowd1: `${organizerFolder}/crowd-1.jpg`,
        crowd2: `${organizerFolder}/crowd-2.jpg`,
        crowd3: `${organizerFolder}/crowd-3.jpg`,
    };

    // 2) Seed events (upsert by slug)
    const events = [
        {
            title: "DJ Flex Winter's Music Festival 2026",
            description:
                "A one-night indoor festival featuring electronic, house, and indie-pop acts with immersive lighting and late-night DJ sets.",
            category: EventCategory.MUSIC,
            status: EventStatus.PUBLISHED,

            heroImage: images.wintersHero,
            galleryImages: [images.crowd1, images.crowd2, images.crowd3],

            venue: "O2 Academy Brixton",
            address: "211 Stockwell Rd",
            city: "London",
            country: "United Kingdom",
            postalCode: "SW9 9SL",

            // Decimal fields: Prisma accepts string for Decimal safely
            latitude: "51.4651",
            longitude: "-0.1146",
            timezone: "Europe/London",

            eventDate: new Date("2026-02-15T19:00:00.000Z"),
            doorsOpen: new Date("2026-02-15T18:00:00.000Z"),
            eventEnd: new Date("2026-02-15T23:30:00.000Z"),

            saleStartDate: new Date("2025-12-01T10:00:00.000Z"),
            saleEndDate: new Date("2026-02-15T17:30:00.000Z"),

            maxTicketsPerOrder: 6,
            totalCapacity: 4500,

            resaleCapType: ResaleCapType.PERCENTAGE_CAP,
            resaleCapValue: 110,
            allowResale: true,

            tiers: [
                {
                    name: "General Admission",
                    description: "Standard entry ticket",
                    price: 4500, // pence (£45.00)
                    quantity: 3000,
                    displayOrder: 1,
                },
                {
                    name: "VIP",
                    description: "VIP entry + fast lane + balcony access",
                    price: 8500, // pence (£85.00)
                    quantity: 500,
                    displayOrder: 2,
                },
            ],
        },
        {
            title: "Summer Rooftop House Party",
            description:
                "Sunset rooftop party with house + disco, street food vendors, and a midnight confetti drop.",
            category: EventCategory.MUSIC,
            status: EventStatus.PUBLISHED,

            heroImage: images.rooftopHero,
            galleryImages: [images.crowd1, images.crowd2, images.crowd3],

            venue: "Skyline Rooftop",
            address: "1 Rooftop Walk",
            city: "Manchester",
            country: "United Kingdom",
            postalCode: "M1 1AA",

            latitude: "53.4808",
            longitude: "-2.2426",
            timezone: "Europe/London",

            eventDate: new Date("2026-06-20T17:00:00.000Z"),
            doorsOpen: new Date("2026-06-20T16:00:00.000Z"),
            eventEnd: new Date("2026-06-20T23:00:00.000Z"),

            saleStartDate: new Date("2026-01-15T10:00:00.000Z"),
            saleEndDate: new Date("2026-06-20T16:00:00.000Z"),

            maxTicketsPerOrder: 10,
            totalCapacity: 1200,

            resaleCapType: ResaleCapType.PERCENTAGE_CAP,
            resaleCapValue: 110,
            allowResale: true,

            tiers: [
                {
                    name: "Early Bird",
                    description: "Limited discounted tickets",
                    price: 2500, // £25.00
                    quantity: 200,
                    displayOrder: 1,
                },
                {
                    name: "Standard",
                    description: "Standard entry ticket",
                    price: 3500, // £35.00
                    quantity: 900,
                    displayOrder: 2,
                },
            ],
        },
    ];

    for (const e of events) {
        const slug = slugify(e.title);

        const savedEvent = await prisma.event.upsert({
            where: { slug },
            update: {
                organizerId: organizer.id,
                title: e.title,
                description: e.description,
                category: e.category,
                status: e.status,
                heroImage: e.heroImage,
                galleryImages: e.galleryImages,
                venue: e.venue,
                address: e.address,
                city: e.city,
                country: e.country,
                postalCode: e.postalCode,
                latitude: e.latitude,
                longitude: e.longitude,
                timezone: e.timezone,
                eventDate: e.eventDate,
                doorsOpen: e.doorsOpen,
                eventEnd: e.eventEnd,
                saleStartDate: e.saleStartDate,
                saleEndDate: e.saleEndDate,
                maxTicketsPerOrder: e.maxTicketsPerOrder,
                totalCapacity: e.totalCapacity,
                resaleCapType: e.resaleCapType,
                resaleCapValue: e.resaleCapValue,
                allowResale: e.allowResale,
                publishedAt: e.status === EventStatus.PUBLISHED ? new Date() : null,
            },
            create: {
                organizerId: organizer.id,
                title: e.title,
                slug,
                description: e.description,
                category: e.category,
                status: e.status,
                heroImage: e.heroImage,
                galleryImages: e.galleryImages,
                venue: e.venue,
                address: e.address,
                city: e.city,
                country: e.country,
                postalCode: e.postalCode,
                latitude: e.latitude,
                longitude: e.longitude,
                timezone: e.timezone,
                eventDate: e.eventDate,
                doorsOpen: e.doorsOpen,
                eventEnd: e.eventEnd,
                saleStartDate: e.saleStartDate,
                saleEndDate: e.saleEndDate,
                maxTicketsPerOrder: e.maxTicketsPerOrder,
                totalCapacity: e.totalCapacity,
                resaleCapType: e.resaleCapType,
                resaleCapValue: e.resaleCapValue,
                allowResale: e.allowResale,
                publishedAt: e.status === EventStatus.PUBLISHED ? new Date() : null,
            },
        });

        // Recreate tiers for this event
        await prisma.ticketTier.deleteMany({ where: { eventId: savedEvent.id } });

        await prisma.ticketTier.createMany({
            data: e.tiers.map((t) => ({
                eventId: savedEvent.id,
                name: t.name,
                description: t.description,
                price: t.price,
                quantity: t.quantity,
                status: TierStatus.ACTIVE,
                maxPerOrder: 10,
                saleStartDate: e.saleStartDate,
                saleEndDate: e.saleEndDate,
                displayOrder: t.displayOrder,
            })),
        });

        console.log(
            `Seeded event: ${savedEvent.title} (${savedEvent.slug}) with ${e.tiers.length} tiers`
        );
    }

    console.log("✅ Seed complete");
    console.log(`📁 Put images under: frontend/public${organizerFolder}/`);
}

main()
    .catch((e) => {
        console.error("❌ Seed failed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
