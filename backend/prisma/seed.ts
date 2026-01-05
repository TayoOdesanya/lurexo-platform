// backend/prisma/seed.ts
import {
  PrismaClient,
  Prisma,
  EventCategory,
  EventStatus,
  ResaleCapType,
} from "@prisma/client";

const prisma = new PrismaClient();

// Same organiser you specified
const ORGANIZER_ID = "540a3869-8aeb-4627-8a2e-e134c6ff3238";

// Prefix to apply to heroImage + ALL gallery images if not already present
const IMAGE_PREFIX = "/events/a060dd68-c98b-44b7-9c92-a1b88a6f892f/";

/**
 * Prefix an image path if it isn't already prefixed.
 * - Leaves absolute URLs unchanged (http/https)
 * - Leaves already-prefixed paths unchanged
 * - Normalizes leading slashes on filenames
 */
function withEventImagePrefix(value: string): string {
  if (!value) return value;

  const v = value.trim();

  // absolute URL? keep
  if (/^https?:\/\//i.test(v)) return v;

  // already prefixed? keep
  if (v.startsWith(IMAGE_PREFIX)) return v;

  // already has some /events/... prefix? keep (safer than double-prefixing)
  if (v.startsWith("/events/")) return v;

  // normalize leading slash on filename
  const normalized = v.startsWith("/") ? v.slice(1) : v;

  return `${IMAGE_PREFIX}${normalized}`;
}

function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

type SeedTier = {
  name: string;
  description: string;
  price: number; // stored as integer pence in your examples
  quantity: number;
  displayOrder: number;
};

type SeedEvent = {
  title: string;
  slug?: string;
  description: string;
  category: EventCategory;
  status: EventStatus;

  heroImage: string;
  galleryImages: string[];

  venue: string;
  address: string;
  city: string;
  country?: string;
  postalCode: string;

  latitude?: string;
  longitude?: string;
  timezone?: string;

  eventDate: Date;
  doorsOpen?: Date | null;
  eventEnd?: Date | null;

  saleStartDate: Date;
  saleEndDate: Date;

  maxTicketsPerOrder?: number;
  totalCapacity: number;

  resaleCapType?: ResaleCapType;
  resaleCapValue?: number | null;
  allowResale?: boolean;

  tiers?: SeedTier[];
};

async function wipeAllEventsAndDependents() {
  // IMPORTANT: payment_splits has a RESTRICT FK to events (per your \d output),
  // so we delete dependents first, then events.
  await prisma.$transaction(async (tx) => {
    // If any of these models don't exist in your schema, remove that line.
    await tx.paymentSplit.deleteMany();
    await tx.ticketListing.deleteMany();
    await tx.ticket.deleteMany();
    await tx.ticketTier.deleteMany();
    await tx.order.deleteMany();

    await tx.event.deleteMany();
  });
}

async function main() {
  // sanity check organizer exists
  const organizer = await prisma.user.findUnique({ where: { id: ORGANIZER_ID } });
  if (!organizer) {
    throw new Error(
      `Organizer user not found: ${ORGANIZER_ID}. Create it first or change ORGANIZER_ID in seed.ts`
    );
  }

  // You said you'll delete all events before reuploading them all.
  // This does it safely, including dependents that would block deletes.
  await wipeAllEventsAndDependents();

  // Simple image "constants" (replace with your real file names/paths if needed)
  const images = {
    wintersHero: "winterHero.jpg",
    rooftopHero: "rooftop-hero.jpg",
    summerFestivalHero: "summer-festival-hero.jpg",
    summerFestival1: "summer-festival-1.jpg",
    summerFestival2: "summer-festival-2.jpg",
    summerFestival3: "summer-festival-3.jpg",
    jazzNightHero: "jazz-night-hero.jpg",
    jazzNight1: "jazz-night-1.jpg",
    jazzNight2: "jazz-night-2.jpg",
    jazzNight3: "jazz-night-3.jpg",
    comedySarahHero: "comedy-sarah-hero.jpg",
    comedySarah1: "comedy-sarah-1.jpg",
    comedySarah2: "comedy-sarah-2.jpg",
    comedySarah3: "comedy-sarah-3.jpg",
    techConfHero: "tech-conf-hero.jpg",
    techConf1: "tech-conf-1.jpg",
    techConf2: "tech-conf-2.jpg",
    techConf3: "tech-conf-3.jpg",
    foodWineHero: "food-wine-hero.jpg",
    foodWine1: "food-wine-1.jpg",
    foodWine2: "food-wine-2.jpg",
    foodWine3: "food-wine-3.jpg",
    artExhibitionHero: "art-exhibition-hero.jpg",
    artExhibition1: "art-exhibition-1.jpg",
    artExhibition2: "art-exhibition-2.jpg",
    artExhibition3: "art-exhibition-3.jpg",

    crowd1: "crowd1.jpg",
    crowd2: "crowd2.jpg",
    crowd3: "crowd3.jpg",

    // from earlier seed set
    indieHero: "indie-hero.jpg",
    indie1: "indie-1.jpg",
    indie2: "indie-2.jpg",
    houseHero: "house-hero.jpg",
    house1: "house-1.jpg",
    house2: "house-2.jpg",
    acousticHero: "acoustic-hero.jpg",
    acoustic1: "acoustic-1.jpg",
    acoustic2: "acoustic-2.jpg",
    dnbHero: "dnb-hero.jpg",
    dnb1: "dnb-1.jpg",
    dnb2: "dnb-2.jpg",
    daypartyHero: "dayparty-hero.jpg",
    dayparty1: "dayparty-1.jpg",
    dayparty2: "dayparty-2.jpg",
    technoHero: "techno-hero.jpg",
    techno1: "techno-1.jpg",
    techno2: "techno-2.jpg",
  };

  // Combined set: regenerated "mine" + your additional events
  const events: SeedEvent[] = [
    // UPDATED DJ Flex event (use your version)
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
          price: 4500,
          quantity: 3000,
          displayOrder: 1,
        },
        {
          name: "VIP",
          description: "VIP entry + fast lane + balcony access",
          price: 8500,
          quantity: 500,
          displayOrder: 2,
        },
      ],
    },

    // Your additional events
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
          price: 2500,
          quantity: 200,
          displayOrder: 1,
        },
        {
          name: "Standard",
          description: "Standard entry ticket",
          price: 3500,
          quantity: 900,
          displayOrder: 2,
        },
      ],
    },
    {
      title: "Summer Music Festival 2025",
      description:
        "A massive outdoor summer festival packed with live acts, great food, and unforgettable vibes in the heart of London.",
      category: EventCategory.MUSIC,
      status: EventStatus.PUBLISHED,
      heroImage: images.summerFestivalHero,
      galleryImages: [
        images.summerFestival1,
        images.summerFestival2,
        images.summerFestival3,
      ],
      venue: "Hyde Park",
      address: "Hyde Park",
      city: "London",
      country: "United Kingdom",
      postalCode: "W2 2UH",
      latitude: "51.5073",
      longitude: "-0.1657",
      timezone: "Europe/London",
      eventDate: new Date("2025-06-15T18:00:00.000Z"),
      doorsOpen: new Date("2025-06-15T17:00:00.000Z"),
      eventEnd: new Date("2025-06-15T23:00:00.000Z"),
      saleStartDate: new Date("2025-03-01T10:00:00.000Z"),
      saleEndDate: new Date("2025-06-15T17:00:00.000Z"),
      maxTicketsPerOrder: 6,
      totalCapacity: 10000,
      resaleCapType: ResaleCapType.PERCENTAGE_CAP,
      resaleCapValue: 110,
      allowResale: true,
      tiers: [
        {
          name: "Early Bird",
          description: "Limited discounted festival entry",
          price: 4500,
          quantity: 1500,
          displayOrder: 1,
        },
        {
          name: "General Admission",
          description: "Standard festival entry",
          price: 6000,
          quantity: 8000,
          displayOrder: 2,
        },
        {
          name: "VIP",
          description: "VIP entry + dedicated bar + viewing area",
          price: 12000,
          quantity: 500,
          displayOrder: 3,
        },
      ],
    },
    {
      title: "Jazz Night Live",
      description: "An intimate night of live jazz at one of London’s most iconic clubs.",
      category: EventCategory.MUSIC,
      status: EventStatus.PUBLISHED,
      heroImage: images.jazzNightHero,
      galleryImages: [images.jazzNight1, images.jazzNight2, images.jazzNight3],
      venue: "Ronnie Scott's",
      address: "47 Frith St",
      city: "London",
      country: "United Kingdom",
      postalCode: "W1D 4HT",
      latitude: "51.5136",
      longitude: "-0.1313",
      timezone: "Europe/London",
      eventDate: new Date("2025-07-22T20:00:00.000Z"),
      doorsOpen: new Date("2025-07-22T19:00:00.000Z"),
      eventEnd: new Date("2025-07-22T23:00:00.000Z"),
      saleStartDate: new Date("2025-05-01T10:00:00.000Z"),
      saleEndDate: new Date("2025-07-22T19:00:00.000Z"),
      maxTicketsPerOrder: 6,
      totalCapacity: 240,
      resaleCapType: ResaleCapType.PERCENTAGE_CAP,
      resaleCapValue: 110,
      allowResale: true,
      tiers: [
        {
          name: "Standard",
          description: "Standard entry ticket",
          price: 4500,
          quantity: 200,
          displayOrder: 1,
        },
        {
          name: "Front Row",
          description: "Premium seating closest to the stage",
          price: 6500,
          quantity: 40,
          displayOrder: 2,
        },
      ],
    },
    {
      title: "Comedy Special - Sarah Johnson",
      description:
        "A brand new stand-up special featuring Sarah Johnson, with support acts and surprise guests.",
      category: EventCategory.COMEDY,
      status: EventStatus.PUBLISHED,
      heroImage: images.comedySarahHero,
      galleryImages: [images.comedySarah1, images.comedySarah2, images.comedySarah3],
      venue: "The Comedy Store",
      address: "1a Oxendon St",
      city: "London",
      country: "United Kingdom",
      postalCode: "SW1Y 4EE",
      latitude: "51.5102",
      longitude: "-0.1337",
      timezone: "Europe/London",
      eventDate: new Date("2025-08-10T19:30:00.000Z"),
      doorsOpen: new Date("2025-08-10T18:30:00.000Z"),
      eventEnd: new Date("2025-08-10T22:00:00.000Z"),
      saleStartDate: new Date("2025-06-01T10:00:00.000Z"),
      saleEndDate: new Date("2025-08-10T18:30:00.000Z"),
      maxTicketsPerOrder: 6,
      totalCapacity: 150,
      resaleCapType: ResaleCapType.PERCENTAGE_CAP,
      resaleCapValue: 110,
      allowResale: true,
      tiers: [
        {
          name: "Early Bird",
          description: "Limited discounted tickets",
          price: 1800,
          quantity: 30,
          displayOrder: 1,
        },
        {
          name: "General Admission",
          description: "Standard entry ticket",
          price: 2500,
          quantity: 110,
          displayOrder: 2,
        },
        {
          name: "Front Row",
          description: "Best seats in the house",
          price: 3500,
          quantity: 10,
          displayOrder: 3,
        },
      ],
    },
    {
      title: "Tech Conference 2025",
      description:
        "A full-day tech conference with keynotes, panels, networking, and hands-on sessions.",
      category: EventCategory.CONFERENCE,
      status: EventStatus.PUBLISHED,
      heroImage: images.techConfHero,
      galleryImages: [images.techConf1, images.techConf2, images.techConf3],
      venue: "ExCeL London",
      address: "Royal Victoria Dock, 1 Western Gateway",
      city: "London",
      country: "United Kingdom",
      postalCode: "E16 1XL",
      latitude: "51.5079",
      longitude: "0.0294",
      timezone: "Europe/London",
      eventDate: new Date("2025-05-20T09:00:00.000Z"),
      doorsOpen: new Date("2025-05-20T08:00:00.000Z"),
      eventEnd: new Date("2025-05-20T17:00:00.000Z"),
      saleStartDate: new Date("2025-02-01T10:00:00.000Z"),
      saleEndDate: new Date("2025-05-20T08:00:00.000Z"),
      maxTicketsPerOrder: 10,
      totalCapacity: 500,
      resaleCapType: ResaleCapType.PERCENTAGE_CAP,
      resaleCapValue: 110,
      allowResale: true,
      tiers: [
        {
          name: "Early Bird",
          description: "Limited discounted conference pass",
          price: 7500,
          quantity: 100,
          displayOrder: 1,
        },
        {
          name: "Standard Pass",
          description: "Conference pass (all talks + expo)",
          price: 9500,
          quantity: 350,
          displayOrder: 2,
        },
        {
          name: "Team Bundle (4)",
          description: "4 passes for teams attending together",
          price: 32000,
          quantity: 50,
          displayOrder: 3,
        },
      ],
    },
    {
      title: "Food & Wine Festival",
      description:
        "A delicious day out featuring street food, wine tasting, and live entertainment at Southbank.",
      category: EventCategory.OTHER,
      status: EventStatus.CANCELLED,
      heroImage: images.foodWineHero,
      galleryImages: [images.foodWine1, images.foodWine2, images.foodWine3],
      venue: "Southbank Centre",
      address: "Belvedere Rd",
      city: "London",
      country: "United Kingdom",
      postalCode: "SE1 8XX",
      latitude: "51.5065",
      longitude: "-0.1163",
      timezone: "Europe/London",
      eventDate: new Date("2025-09-05T12:00:00.000Z"),
      doorsOpen: new Date("2025-09-05T11:00:00.000Z"),
      eventEnd: new Date("2025-09-05T20:00:00.000Z"),
      saleStartDate: new Date("2025-06-01T10:00:00.000Z"),
      saleEndDate: new Date("2025-09-05T11:00:00.000Z"),
      maxTicketsPerOrder: 6,
      totalCapacity: 800,
      resaleCapType: ResaleCapType.PERCENTAGE_CAP,
      resaleCapValue: 110,
      allowResale: true,
      tiers: [
        {
          name: "Early Bird",
          description: "Limited discounted tickets",
          price: 3500,
          quantity: 150,
          displayOrder: 1,
        },
        {
          name: "General Admission",
          description: "Standard entry ticket",
          price: 4500,
          quantity: 650,
          displayOrder: 2,
        },
      ],
    },
    {
      title: "Art Exhibition Opening",
      description:
        "Opening night for a new exhibition with talks, drinks, and an exclusive first look.",
      category: EventCategory.ARTS,
      status: EventStatus.COMPLETED,
      heroImage: images.artExhibitionHero,
      galleryImages: [
        images.artExhibition1,
        images.artExhibition2,
        images.artExhibition3,
      ],
      venue: "Tate Modern",
      address: "Bankside",
      city: "London",
      country: "United Kingdom",
      postalCode: "SE1 9TG",
      latitude: "51.5076",
      longitude: "-0.0994",
      timezone: "Europe/London",
      eventDate: new Date("2025-04-15T18:00:00.000Z"),
      doorsOpen: new Date("2025-04-15T17:00:00.000Z"),
      eventEnd: new Date("2025-04-15T21:00:00.000Z"),
      saleStartDate: new Date("2025-02-15T10:00:00.000Z"),
      saleEndDate: new Date("2025-04-15T17:00:00.000Z"),
      maxTicketsPerOrder: 6,
      totalCapacity: 350,
      resaleCapType: ResaleCapType.PERCENTAGE_CAP,
      resaleCapValue: 110,
      allowResale: true,
      tiers: [
        {
          name: "General Admission",
          description: "Standard entry ticket",
          price: 2500,
          quantity: 300,
          displayOrder: 1,
        },
        {
          name: "Members Preview",
          description: "Early access + welcome drink",
          price: 3500,
          quantity: 50,
          displayOrder: 2,
        },
      ],
    },

    // Regenerated "mine" from earlier (kept, but now also include tiers so it's more realistic)
    {
      title: "Lurexo Indie Night",
      description: "Indie bands and special guests.",
      category: EventCategory.MUSIC,
      status: EventStatus.PUBLISHED,
      heroImage: images.indieHero,
      galleryImages: [images.indie1, images.indie2],
      venue: "The Garage",
      address: "20-22 Highbury Corner",
      city: "London",
      country: "United Kingdom",
      postalCode: "N5 1RD",
      latitude: "51.5468",
      longitude: "-0.1037",
      timezone: "Europe/London",
      eventDate: new Date("2026-02-08T19:00:00.000Z"),
      doorsOpen: new Date("2026-02-08T18:00:00.000Z"),
      eventEnd: new Date("2026-02-08T23:00:00.000Z"),
      saleStartDate: new Date("2026-01-05T10:00:00.000Z"),
      saleEndDate: new Date("2026-02-08T18:00:00.000Z"),
      maxTicketsPerOrder: 10,
      totalCapacity: 900,
      tiers: [
        { name: "General", description: "Standard entry ticket", price: 3000, quantity: 800, displayOrder: 1 },
        { name: "Student", description: "Discounted ticket (ID required)", price: 2200, quantity: 100, displayOrder: 2 },
      ],
    },
    {
      title: "House Sessions",
      description: "House music all night.",
      category: EventCategory.MUSIC,
      status: EventStatus.PUBLISHED,
      heroImage: images.houseHero,
      galleryImages: [images.house1, images.house2],
      venue: "Studio 338",
      address: "338 Boord St",
      city: "London",
      country: "United Kingdom",
      postalCode: "SE10 0PF",
      latitude: "51.5009",
      longitude: "0.0054",
      timezone: "Europe/London",
      eventDate: new Date("2026-02-14T20:00:00.000Z"),
      doorsOpen: new Date("2026-02-14T19:00:00.000Z"),
      eventEnd: new Date("2026-02-15T01:00:00.000Z"),
      saleStartDate: new Date("2026-01-05T10:00:00.000Z"),
      saleEndDate: new Date("2026-02-14T19:00:00.000Z"),
      maxTicketsPerOrder: 10,
      totalCapacity: 3000,
      tiers: [
        { name: "Early Bird", description: "Limited discounted tickets", price: 2500, quantity: 300, displayOrder: 1 },
        { name: "General", description: "Standard entry ticket", price: 3500, quantity: 2500, displayOrder: 2 },
        { name: "VIP", description: "VIP entry + perks", price: 6500, quantity: 200, displayOrder: 3 },
      ],
    },
    {
      title: "Acoustic Evening",
      description: "Seated acoustic performances.",
      category: EventCategory.MUSIC,
      status: EventStatus.PUBLISHED,
      heroImage: images.acousticHero,
      galleryImages: [images.acoustic1, images.acoustic2],
      venue: "Union Chapel",
      address: "Compton Terrace",
      city: "London",
      country: "United Kingdom",
      postalCode: "N1 2UN",
      latitude: "51.5454",
      longitude: "-0.1161",
      timezone: "Europe/London",
      eventDate: new Date("2026-02-20T19:30:00.000Z"),
      doorsOpen: new Date("2026-02-20T18:30:00.000Z"),
      eventEnd: new Date("2026-02-20T22:00:00.000Z"),
      saleStartDate: new Date("2026-01-05T10:00:00.000Z"),
      saleEndDate: new Date("2026-02-20T18:30:00.000Z"),
      maxTicketsPerOrder: 6,
      totalCapacity: 1200,
      tiers: [
        { name: "Standard", description: "Seated entry", price: 2800, quantity: 1000, displayOrder: 1 },
        { name: "Premium", description: "Front seating section", price: 4200, quantity: 200, displayOrder: 2 },
      ],
    },
    {
      title: "DNB Warehouse",
      description: "Drum & Bass warehouse special.",
      category: EventCategory.MUSIC,
      status: EventStatus.DRAFT,
      heroImage: images.dnbHero,
      galleryImages: [images.dnb1, images.dnb2],
      venue: "Printworks",
      address: "Surrey Quays Rd",
      city: "London",
      country: "United Kingdom",
      postalCode: "SE16 7PJ",
      latitude: "51.5010",
      longitude: "-0.0470",
      timezone: "Europe/London",
      eventDate: new Date("2026-02-27T21:00:00.000Z"),
      doorsOpen: new Date("2026-02-27T20:00:00.000Z"),
      eventEnd: new Date("2026-02-28T03:00:00.000Z"),
      saleStartDate: new Date("2026-01-10T10:00:00.000Z"),
      saleEndDate: new Date("2026-02-27T20:00:00.000Z"),
      maxTicketsPerOrder: 10,
      totalCapacity: 5000,
      tiers: [
        { name: "General", description: "Standard entry", price: 4500, quantity: 4500, displayOrder: 1 },
        { name: "VIP", description: "VIP entry", price: 8000, quantity: 500, displayOrder: 2 },
      ],
    },
    {
      title: "Sunday Day Party",
      description: "Daytime party with DJs.",
      category: EventCategory.MUSIC,
      status: EventStatus.PUBLISHED,
      heroImage: images.daypartyHero,
      galleryImages: [images.dayparty1, images.dayparty2],
      venue: "Tobacco Dock",
      address: "Wapping Ln",
      city: "London",
      country: "United Kingdom",
      postalCode: "E1W 2SF",
      latitude: "51.5087",
      longitude: "-0.0561",
      timezone: "Europe/London",
      eventDate: new Date("2026-03-01T14:00:00.000Z"),
      doorsOpen: new Date("2026-03-01T13:00:00.000Z"),
      eventEnd: new Date("2026-03-01T20:00:00.000Z"),
      saleStartDate: new Date("2026-01-05T10:00:00.000Z"),
      saleEndDate: new Date("2026-03-01T13:00:00.000Z"),
      maxTicketsPerOrder: 10,
      totalCapacity: 2500,
      tiers: [
        { name: "Early Bird", description: "Limited discounted tickets", price: 2500, quantity: 300, displayOrder: 1 },
        { name: "Standard", description: "Standard entry", price: 3500, quantity: 2200, displayOrder: 2 },
      ],
    },
    {
      title: "Techno All Night",
      description: "All-night techno session with rotating headliners.",
      category: EventCategory.MUSIC,
      status: EventStatus.PUBLISHED,
      heroImage: images.technoHero,
      galleryImages: [images.techno1, images.techno2],
      venue: "FOLD",
      address: "Gillender St",
      city: "London",
      country: "United Kingdom",
      postalCode: "E3 2PJ",
      latitude: "51.5340",
      longitude: "-0.0160",
      timezone: "Europe/London",
      eventDate: new Date("2026-03-07T22:00:00.000Z"),
      doorsOpen: new Date("2026-03-07T21:00:00.000Z"),
      eventEnd: new Date("2026-03-08T05:00:00.000Z"),
      saleStartDate: new Date("2026-01-05T10:00:00.000Z"),
      saleEndDate: new Date("2026-03-07T21:00:00.000Z"),
      maxTicketsPerOrder: 10,
      totalCapacity: 1800,
      allowResale: true,
      resaleCapType: ResaleCapType.PERCENTAGE_CAP,
      resaleCapValue: 110,
      tiers: [
        { name: "General", description: "Standard entry", price: 3500, quantity: 1700, displayOrder: 1 },
        { name: "VIP", description: "VIP entry + perks", price: 7000, quantity: 100, displayOrder: 2 },
      ],
    },
  ];

  // De-dupe by slug (we generate below). If duplicates exist, later entries win.
  const bySlug = new Map<string, SeedEvent>();
  for (const e of events) {
    const slug = e.slug ?? slugify(e.title);
    bySlug.set(slug, { ...e, slug });
  }
  const finalEvents = [...bySlug.values()];

  // Create all events (fresh DB) + tiers
  // We use create (not upsert) since we wipe everything first; simpler and faster.
  for (const e of finalEvents) {
    const heroImage = withEventImagePrefix(e.heroImage);
    const galleryImages = (e.galleryImages ?? []).map(withEventImagePrefix);

    const publishedAt =
      e.status === EventStatus.PUBLISHED ? e.saleStartDate : null;

    const created = await prisma.event.create({
      data: {
        organizerId: ORGANIZER_ID,
        title: e.title,
        slug: e.slug!,
        description: e.description,
        category: e.category,
        status: e.status,

        heroImage,
        galleryImages,

        venue: e.venue,
        address: e.address,
        city: e.city,
        country: e.country ?? "United Kingdom",
        postalCode: e.postalCode,

        latitude: e.latitude ? new Prisma.Decimal(e.latitude) : undefined,
        longitude: e.longitude ? new Prisma.Decimal(e.longitude) : undefined,

        eventDate: e.eventDate,
        doorsOpen: e.doorsOpen ?? undefined,
        eventEnd: e.eventEnd ?? undefined,
        timezone: e.timezone ?? "Europe/London",

        saleStartDate: e.saleStartDate,
        saleEndDate: e.saleEndDate,

        maxTicketsPerOrder: e.maxTicketsPerOrder ?? 10,
        totalCapacity: e.totalCapacity,

        allowResale: e.allowResale ?? true,
        resaleCapType: e.resaleCapType ?? ResaleCapType.PERCENTAGE_CAP,
        resaleCapValue: e.resaleCapValue ?? 110,

        publishedAt,
      },
    });

    // If you don't want tiers at all, remove this whole block.
    // Assumes TicketTier has: eventId, name, description, price, quantity, displayOrder.
    if (e.tiers?.length) {
      await prisma.ticketTier.createMany({
        data: e.tiers.map((t) => ({
          eventId: created.id,
          name: t.name,
          description: t.description,
          price: t.price,
          quantity: t.quantity,
          displayOrder: t.displayOrder,
        })),
      });
    }
  }

  const eventCount = await prisma.event.count();
  const tierCount = await prisma.ticketTier.count();

  console.log(
    `✅ Seed complete: ${eventCount} events + ${tierCount} ticket tiers for organizer ${ORGANIZER_ID}`
  );
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
