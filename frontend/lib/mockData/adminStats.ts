import {
  PlatformStats,
  Alert,
  PopularEvent,
  PopularOrganizer,
  PopularArtist,
  ActivityItem,
  ChartDataPoint,
} from '../../app/types/admin';

// ============================================================================
// PLATFORM STATS
// ============================================================================

export const mockPlatformStats: PlatformStats = {
  totalUsers: 12547,
  totalOrganizers: 342,
  totalArtists: 156,
  totalRevenue: 487293,
  changeVsPrevious: {
    users: 12,
    organizers: 23,
    artists: 18,
    revenue: 34,
  },
};

// ============================================================================
// ALERTS
// ============================================================================

export const mockAlerts: Alert[] = [
  {
    id: '1',
    type: 'event_approval',
    count: 8,
    message: 'Events Pending Approval',
    priority: 'high',
    link: '/admin/events/pending',
  },
  {
    id: '2',
    type: 'organizer_verification',
    count: 3,
    message: 'Organizers Pending Verification',
    priority: 'medium',
    link: '/admin/organizers/pending-verification',
  },
  {
    id: '3',
    type: 'support_ticket',
    count: 12,
    message: 'Unresolved Support Tickets',
    priority: 'medium',
    link: '/admin/support',
  },
];

// ============================================================================
// CHART DATA
// ============================================================================

export const mockRevenueData: ChartDataPoint[] = [
  { date: '2025-10-15', value: 12500 },
  { date: '2025-10-22', value: 15800 },
  { date: '2025-10-29', value: 18200 },
  { date: '2025-11-05', value: 14600 },
  { date: '2025-11-12', value: 21300 },
  { date: '2025-11-19', value: 25400 },
  { date: '2025-11-26', value: 19800 },
  { date: '2025-12-03', value: 28900 },
  { date: '2025-12-10', value: 32100 },
  { date: '2025-12-17', value: 35600 },
  { date: '2025-12-24', value: 29400 },
  { date: '2025-12-31', value: 42800 },
  { date: '2026-01-07', value: 38200 },
];

export const mockEventCreationData: ChartDataPoint[] = [
  { date: '2025-10-15', value: 12 },
  { date: '2025-10-22', value: 15 },
  { date: '2025-10-29', value: 18 },
  { date: '2025-11-05', value: 14 },
  { date: '2025-11-12', value: 22 },
  { date: '2025-11-19', value: 25 },
  { date: '2025-11-26', value: 19 },
  { date: '2025-12-03', value: 28 },
  { date: '2025-12-10', value: 31 },
  { date: '2025-12-17', value: 35 },
  { date: '2025-12-24', value: 27 },
  { date: '2025-12-31', value: 42 },
  { date: '2026-01-07', value: 38 },
];

export const mockUserGrowthData: ChartDataPoint[] = [
  { date: '2025-10-15', value: 11200 },
  { date: '2025-10-22', value: 11450 },
  { date: '2025-10-29', value: 11680 },
  { date: '2025-11-05', value: 11820 },
  { date: '2025-11-12', value: 12050 },
  { date: '2025-11-19', value: 12180 },
  { date: '2025-11-26', value: 12290 },
  { date: '2025-12-03', value: 12410 },
  { date: '2025-12-10', value: 12547 },
  { date: '2025-12-17', value: 12680 },
  { date: '2025-12-24', value: 12790 },
  { date: '2025-12-31', value: 12920 },
  { date: '2026-01-07', value: 13050 },
];

// ============================================================================
// POPULAR ITEMS
// ============================================================================

export const mockPopularEvents: PopularEvent[] = [
  {
    id: '1',
    name: 'Summer Music Festival 2026',
    ticketsSold: 2340,
    revenue: 117000,
    date: '2026-07-15',
  },
  {
    id: '2',
    name: 'Tech Conference London',
    ticketsSold: 1890,
    revenue: 189000,
    date: '2026-03-22',
  },
  {
    id: '3',
    name: 'Comedy Night Live',
    ticketsSold: 1567,
    revenue: 39175,
    date: '2026-02-14',
  },
];

export const mockPopularOrganizers: PopularOrganizer[] = [
  {
    id: '1',
    name: 'EventCo Ltd',
    totalEvents: 12,
    revenue: 45320,
    eventsCount: 12,
  },
  {
    id: '2',
    name: 'Live Nation UK',
    totalEvents: 8,
    revenue: 38900,
    eventsCount: 8,
  },
  {
    id: '3',
    name: 'Local Venues Group',
    totalEvents: 15,
    revenue: 28450,
    eventsCount: 15,
  },
];

export const mockPopularArtists: PopularArtist[] = [
  {
    id: '1',
    name: 'DJ Example',
    eventsCount: 5,
    ticketsSold: 3200,
    totalRevenue: 96000,
  },
  {
    id: '2',
    name: 'The Band Name',
    eventsCount: 3,
    ticketsSold: 2100,
    totalRevenue: 84000,
  },
  {
    id: '3',
    name: 'Comedian Joe',
    eventsCount: 8,
    ticketsSold: 1890,
    totalRevenue: 47250,
  },
];

// ============================================================================
// ACTIVITY FEED
// ============================================================================

export const mockActivityFeed: ActivityItem[] = [
  {
    id: '1',
    type: 'support_ticket',
    message: 'Support ticket #LURX-1234 created',
    timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    userId: 'user-123',
    userName: 'Sarah Johnson',
  },
  {
    id: '2',
    type: 'event_created',
    message: 'Event "Summer Festival" submitted for approval',
    timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    userId: 'org-456',
    userName: 'EventCo Ltd',
  },
  {
    id: '3',
    type: 'payout_processed',
    message: 'Payout processed: £5,000 to Live Nation UK',
    timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
    userId: 'org-789',
    userName: 'Live Nation UK',
  },
  {
    id: '4',
    type: 'ticket_purchased',
    message: '15 tickets purchased for "Tech Conference"',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    userId: 'user-321',
    userName: 'John Smith',
  },
  {
    id: '5',
    type: 'user_signup',
    message: 'New user registered: Emma Wilson',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    userId: 'user-654',
    userName: 'Emma Wilson',
  },
  {
    id: '6',
    type: 'event_approved',
    message: 'Event "Comedy Night" approved and published',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    userId: 'admin-001',
    userName: 'Admin Team',
  },
  {
    id: '7',
    type: 'ticket_purchased',
    message: '8 tickets purchased for "Music Concert"',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    userId: 'user-987',
    userName: 'David Lee',
  },
  {
    id: '8',
    type: 'support_ticket',
    message: 'Support ticket #LURX-1233 resolved',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    userId: 'admin-002',
    userName: 'Support Team',
  },
  {
    id: '9',
    type: 'event_created',
    message: 'Event "Winter Gala" submitted for approval',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    userId: 'org-111',
    userName: 'Gala Events',
  },
  {
    id: '10',
    type: 'user_signup',
    message: 'New organizer registered: Premium Productions',
    timestamp: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
    userId: 'org-222',
    userName: 'Premium Productions',
  },

];

// ============================================================================
// EVENT MODERATION DATA
// ============================================================================

import { AdminEvent } from '../../app/types/admin';

export const mockPendingEvents: AdminEvent[] = [
  {
    id: 'evt-001',
    title: 'Summer Music Festival 2026',
    organizerId: 'org-123',
    organizerName: 'EventCo Ltd',
    approvalStatus: 'pending_approval',
    flaggedReasons: ['high_ticket_price'],
    submittedAt: '2026-01-14T10:30:00Z',
    ticketsSold: 0,
    revenue: 0,
    date: '2026-07-15T18:00:00Z',
    venue: 'Hyde Park, London',
  },
  {
    id: 'evt-002',
    title: 'Crypto Investment Masterclass',
    organizerId: 'org-456',
    organizerName: 'Quick Rich Ltd',
    approvalStatus: 'pending_approval',
    flaggedReasons: ['suspicious_content', 'potential_scam'],
    submittedAt: '2026-01-14T09:15:00Z',
    ticketsSold: 0,
    revenue: 0,
    date: '2026-02-20T19:00:00Z',
    venue: 'Online Event',
  },
  {
    id: 'evt-003',
    title: 'Tech Conference London 2026',
    organizerId: 'org-789',
    organizerName: 'Tech Events UK',
    approvalStatus: 'pending_approval',
    flaggedReasons: [],
    submittedAt: '2026-01-14T08:00:00Z',
    ticketsSold: 0,
    revenue: 0,
    date: '2026-03-22T09:00:00Z',
    venue: 'ExCeL London',
  },
  {
    id: 'evt-004',
    title: 'Political Rally - Vote YES',
    organizerId: 'org-321',
    organizerName: 'Citizens Group',
    approvalStatus: 'pending_approval',
    flaggedReasons: ['political_content'],
    submittedAt: '2026-01-13T16:45:00Z',
    ticketsSold: 0,
    revenue: 0,
    date: '2026-02-10T14:00:00Z',
    venue: 'Trafalgar Square, London',
  },
  {
    id: 'evt-005',
    title: 'Comedy Night with Sarah Johnson',
    organizerId: 'org-654',
    organizerName: 'Laugh Factory UK',
    approvalStatus: 'pending_approval',
    flaggedReasons: [],
    submittedAt: '2026-01-13T14:20:00Z',
    ticketsSold: 0,
    revenue: 0,
    date: '2026-02-14T20:00:00Z',
    venue: 'Comedy Store, Manchester',
  },
  {
    id: 'evt-006',
    title: 'Exclusive VIP Networking Event',
    organizerId: 'org-987',
    organizerName: 'Elite Connections',
    approvalStatus: 'pending_approval',
    flaggedReasons: ['high_ticket_price'],
    submittedAt: '2026-01-13T11:30:00Z',
    ticketsSold: 0,
    revenue: 0,
    date: '2026-02-28T18:00:00Z',
    venue: 'The Shard, London',
  },
  {
    id: 'evt-007',
    title: 'Kids Fun Day',
    organizerId: 'org-111',
    organizerName: 'Family Events Co',
    approvalStatus: 'pending_approval',
    flaggedReasons: [],
    submittedAt: '2026-01-12T15:00:00Z',
    ticketsSold: 0,
    revenue: 0,
    date: '2026-03-15T10:00:00Z',
    venue: 'Victoria Park, London',
  },
  {
    id: 'evt-008',
    title: 'Underground Rave 2026',
    organizerId: 'org-222',
    organizerName: 'Night Owls Ltd',
    approvalStatus: 'pending_approval',
    flaggedReasons: ['inappropriate_language'],
    submittedAt: '2026-01-12T12:30:00Z',
    ticketsSold: 0,
    revenue: 0,
    date: '2026-02-05T23:00:00Z',
    venue: 'Location TBA',
  },
];

export const mockLiveEvents: AdminEvent[] = [
  {
    id: 'evt-101',
    title: 'New Year Celebration 2026',
    organizerId: 'org-888',
    organizerName: 'City Events Ltd',
    approvalStatus: 'live',
    submittedAt: '2025-11-15T10:00:00Z',
    approvedAt: '2025-11-16T14:30:00Z',
    approvedBy: 'admin-001',
    ticketsSold: 2340,
    revenue: 117000,
    date: '2026-01-31T20:00:00Z',
    venue: 'O2 Arena, London',
  },
  {
    id: 'evt-102',
    title: 'Valentine\'s Concert',
    organizerId: 'org-999',
    organizerName: 'Romance Events',
    approvalStatus: 'live',
    submittedAt: '2025-12-01T09:00:00Z',
    approvedAt: '2025-12-02T11:15:00Z',
    approvedBy: 'admin-002',
    ticketsSold: 1567,
    revenue: 39175,
    date: '2026-02-14T19:00:00Z',
    venue: 'Royal Albert Hall, London',
  },
];

export const mockPastEvents: AdminEvent[] = [
  {
    id: 'evt-201',
    title: 'Christmas Market 2025',
    organizerId: 'org-555',
    organizerName: 'Winter Wonderland Ltd',
    approvalStatus: 'ended',
    submittedAt: '2025-10-01T10:00:00Z',
    approvedAt: '2025-10-02T15:00:00Z',
    approvedBy: 'admin-001',
    ticketsSold: 5420,
    revenue: 135500,
    date: '2025-12-24T10:00:00Z',
    venue: 'Hyde Park, London',
  },
];

export const mockAllEvents: AdminEvent[] = [
  ...mockPendingEvents,
  ...mockLiveEvents,
  ...mockPastEvents,
];

// Detailed event data for review page
export interface EventDetailForReview extends AdminEvent {
  description: string;
  ticketTiers: {
    name: string;
    price: number;
    quantity: number;
    sold: number;
  }[];
  organizerEmail: string;
  organizerPhone: string;
  organizerVerified: boolean;
  images: string[];
  category: string;
  ageRestriction: string;
  refundPolicy: string;
}

export const mockEventDetail: EventDetailForReview = {
  id: 'evt-001',
  title: 'Summer Music Festival 2026',
  organizerId: 'org-123',
  organizerName: 'EventCo Ltd',
  approvalStatus: 'pending_approval',
  flaggedReasons: ['high_ticket_price'],
  submittedAt: '2026-01-14T10:30:00Z',
  ticketsSold: 0,
  revenue: 0,
  date: '2026-07-15T18:00:00Z',
  venue: 'Hyde Park, London',
  description: 'Join us for the biggest summer music festival of 2026! Featuring top international artists, food vendors, and an unforgettable experience under the stars.',
  ticketTiers: [
    { name: 'General Admission', price: 50, quantity: 5000, sold: 0 },
    { name: 'VIP', price: 150, quantity: 500, sold: 0 },
    { name: 'Premium VIP', price: 750, quantity: 100, sold: 0 },
  ],
  organizerEmail: 'contact@eventco.com',
  organizerPhone: '+44 20 1234 5678',
  organizerVerified: true,
  images: [
    'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800',
    'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800',
  ],
  category: 'Music',
  ageRestriction: '18+',
  refundPolicy: 'Full refund up to 30 days before event',
};

// ============================================================================
// SUPPORT TICKETS DATA
// ============================================================================

import { SupportTicket, SupportMessage } from '../../app/types/admin';

export const mockSupportTickets: SupportTicket[] = [
  {
    id: 'ticket-001',
    ticketNumber: 'LURX-1234',
    userId: 'user-123',
    userName: 'Sarah Johnson',
    userEmail: 'sarah.johnson@email.com',
    subject: 'Cannot download my tickets',
    category: 'technical',
    priority: 'high',
    status: 'open',
    createdAt: '2026-01-15T09:30:00Z',
    updatedAt: '2026-01-15T09:30:00Z',
    messagesCount: 1,
  },
  {
    id: 'ticket-002',
    ticketNumber: 'LURX-1233',
    userId: 'user-456',
    userName: 'Michael Chen',
    userEmail: 'michael.chen@email.com',
    subject: 'Refund request for cancelled event',
    category: 'billing',
    priority: 'urgent',
    status: 'in_progress',
    createdAt: '2026-01-14T14:20:00Z',
    updatedAt: '2026-01-15T08:15:00Z',
    messagesCount: 4,
  },
  {
    id: 'ticket-003',
    ticketNumber: 'LURX-1232',
    userId: 'user-789',
    userName: 'Emma Wilson',
    userEmail: 'emma.wilson@email.com',
    subject: 'Event not showing in my orders',
    category: 'account',
    priority: 'medium',
    status: 'waiting_response',
    createdAt: '2026-01-14T10:45:00Z',
    updatedAt: '2026-01-14T16:30:00Z',
    messagesCount: 3,
  },
  {
    id: 'ticket-004',
    ticketNumber: 'LURX-1231',
    userId: 'user-321',
    userName: 'David Lee',
    userEmail: 'david.lee@email.com',
    subject: 'How to transfer tickets to a friend?',
    category: 'other',
    priority: 'low',
    status: 'open',
    createdAt: '2026-01-14T08:00:00Z',
    updatedAt: '2026-01-14T08:00:00Z',
    messagesCount: 1,
  },
  {
    id: 'ticket-005',
    ticketNumber: 'LURX-1230',
    userId: 'user-654',
    userName: 'Sophie Martin',
    userEmail: 'sophie.martin@email.com',
    subject: 'Incorrect email on confirmation',
    category: 'account',
    priority: 'medium',
    status: 'resolved',
    createdAt: '2026-01-13T15:30:00Z',
    updatedAt: '2026-01-14T09:00:00Z',
    resolvedAt: '2026-01-14T09:00:00Z',
    resolvedBy: 'admin-001',
    messagesCount: 5,
  },
  {
    id: 'ticket-006',
    ticketNumber: 'LURX-1229',
    userId: 'user-987',
    userName: 'James Brown',
    userEmail: 'james.brown@email.com',
    subject: 'Payment failed but money was charged',
    category: 'billing',
    priority: 'urgent',
    status: 'in_progress',
    createdAt: '2026-01-13T12:00:00Z',
    updatedAt: '2026-01-15T07:45:00Z',
    messagesCount: 6,
  },
  {
    id: 'ticket-007',
    ticketNumber: 'LURX-1228',
    userId: 'user-111',
    userName: 'Olivia Taylor',
    userEmail: 'olivia.taylor@email.com',
    subject: 'Event location changed, need refund',
    category: 'event',
    priority: 'high',
    status: 'open',
    createdAt: '2026-01-13T10:15:00Z',
    updatedAt: '2026-01-13T10:15:00Z',
    messagesCount: 1,
  },
  {
    id: 'ticket-008',
    ticketNumber: 'LURX-1227',
    userId: 'user-222',
    userName: 'Lucas Anderson',
    userEmail: 'lucas.anderson@email.com',
    subject: 'QR code not scanning at venue',
    category: 'technical',
    priority: 'urgent',
    status: 'resolved',
    createdAt: '2026-01-12T18:30:00Z',
    updatedAt: '2026-01-12T19:00:00Z',
    resolvedAt: '2026-01-12T19:00:00Z',
    resolvedBy: 'admin-002',
    messagesCount: 3,
  },
];

// Detailed ticket with conversation thread
export const mockTicketDetail: SupportTicket & { messages: SupportMessage[] } = {
  id: 'ticket-001',
  ticketNumber: 'LURX-1234',
  userId: 'user-123',
  userName: 'Sarah Johnson',
  userEmail: 'sarah.johnson@email.com',
  subject: 'Cannot download my tickets',
  category: 'technical',
  priority: 'high',
  status: 'open',
  createdAt: '2026-01-15T09:30:00Z',
  updatedAt: '2026-01-15T09:30:00Z',
  messagesCount: 1,
  messages: [
    {
      id: 'msg-001',
      ticketId: 'ticket-001',
      senderId: 'user-123',
      senderName: 'Sarah Johnson',
      senderRole: 'user',
      message: 'Hi, I purchased tickets for the Summer Music Festival but I cannot download them from my account. I\'ve tried on both my phone and computer but the download button doesn\'t work. Can you please help?',
      isInternalNote: false,
      createdAt: '2026-01-15T09:30:00Z',
    },
  ],
};

// Filter tickets by status
export const mockOpenTickets = mockSupportTickets.filter(t => t.status === 'open' || t.status === 'in_progress' || t.status === 'waiting_response');
export const mockResolvedTickets = mockSupportTickets.filter(t => t.status === 'resolved' || t.status === 'closed');

// ============================================================================
// USERS MANAGEMENT DATA
// ============================================================================

import { AdminUser } from '../../app/types/admin';

export const mockAdminUsers: AdminUser[] = [
  {
    id: 'user-001',
    email: 'sarah.johnson@email.com',
    name: 'Sarah Johnson',
    role: 'user',
    isAdmin: false,
    isSuspended: false,
    createdAt: '2025-11-15T10:30:00Z',
    lastLogin: '2026-01-15T14:22:00Z',
    totalSpent: 234.50,
    ticketsPurchased: 8,
  },
  {
    id: 'user-002',
    email: 'michael.chen@email.com',
    name: 'Michael Chen',
    role: 'organizer',
    isAdmin: false,
    isSuspended: false,
    createdAt: '2025-10-20T09:15:00Z',
    lastLogin: '2026-01-16T08:45:00Z',
    totalSpent: 0,
    ticketsPurchased: 0,
  },
  {
    id: 'user-003',
    email: 'emma.wilson@email.com',
    name: 'Emma Wilson',
    role: 'user',
    isAdmin: false,
    isSuspended: false,
    createdAt: '2025-12-05T16:20:00Z',
    lastLogin: '2026-01-14T19:30:00Z',
    totalSpent: 450.00,
    ticketsPurchased: 12,
  },
  {
    id: 'user-004',
    email: 'david.lee@email.com',
    name: 'David Lee',
    role: 'user',
    isAdmin: false,
    isSuspended: true,
    suspensionReason: 'Violated terms of service - attempted ticket scalping',
    createdAt: '2025-09-10T11:00:00Z',
    lastLogin: '2026-01-10T12:15:00Z',
    totalSpent: 89.50,
    ticketsPurchased: 3,
  },
  {
    id: 'user-005',
    email: 'admin@lurexo.com',
    name: 'Tayo (Admin)',
    role: 'admin',
    isAdmin: true,
    isSuspended: false,
    createdAt: '2025-08-01T00:00:00Z',
    lastLogin: '2026-01-16T21:35:00Z',
    totalSpent: 0,
    ticketsPurchased: 0,
  },
  {
    id: 'user-006',
    email: 'sophie.martin@email.com',
    name: 'Sophie Martin',
    role: 'user',
    isAdmin: false,
    isSuspended: false,
    createdAt: '2025-11-28T13:45:00Z',
    lastLogin: '2026-01-15T17:00:00Z',
    totalSpent: 125.00,
    ticketsPurchased: 5,
  },
  {
    id: 'user-007',
    email: 'james.brown@email.com',
    name: 'James Brown',
    role: 'organizer',
    isAdmin: false,
    isSuspended: false,
    createdAt: '2025-10-12T08:30:00Z',
    lastLogin: '2026-01-16T09:20:00Z',
    totalSpent: 0,
    ticketsPurchased: 0,
  },
  {
    id: 'user-008',
    email: 'olivia.taylor@email.com',
    name: 'Olivia Taylor',
    role: 'user',
    isAdmin: false,
    isSuspended: false,
    createdAt: '2026-01-02T15:10:00Z',
    lastLogin: '2026-01-16T10:05:00Z',
    totalSpent: 75.00,
    ticketsPurchased: 2,
  },
  {
    id: 'user-009',
    email: 'lucas.anderson@email.com',
    name: 'Lucas Anderson',
    role: 'user',
    isAdmin: false,
    isSuspended: false,
    createdAt: '2025-09-25T12:00:00Z',
    lastLogin: '2026-01-13T20:45:00Z',
    totalSpent: 567.50,
    ticketsPurchased: 18,
  },
  {
    id: 'user-010',
    email: 'charlotte.white@email.com',
    name: 'Charlotte White',
    role: 'artist',
    isAdmin: false,
    isSuspended: false,
    createdAt: '2025-11-01T10:00:00Z',
    lastLogin: '2026-01-15T11:30:00Z',
    totalSpent: 0,
    ticketsPurchased: 0,
  },
];

// ============================================================================
// ORGANIZERS MANAGEMENT DATA
// ============================================================================

import { AdminOrganizer } from '../../app/types/admin';

export const mockAdminOrganizers: AdminOrganizer[] = [
  {
    id: 'org-001',
    name: 'EventCo Ltd',
    email: 'contact@eventco.com',
    verificationStatus: 'verified',
    documentsSubmitted: true,
    totalEvents: 12,
    totalRevenue: 87500,
    createdAt: '2025-09-15T10:00:00Z',
    verifiedAt: '2025-09-20T14:30:00Z',
  },
  {
    id: 'org-002',
    name: 'Live Nation UK',
    email: 'info@livenation.co.uk',
    verificationStatus: 'verified',
    documentsSubmitted: true,
    totalEvents: 8,
    totalRevenue: 156000,
    createdAt: '2025-08-10T09:00:00Z',
    verifiedAt: '2025-08-12T11:00:00Z',
  },
  {
    id: 'org-003',
    name: 'Quick Rich Ltd',
    email: 'admin@quickrich.com',
    verificationStatus: 'pending',
    documentsSubmitted: true,
    totalEvents: 0,
    totalRevenue: 0,
    createdAt: '2026-01-14T15:30:00Z',
  },
  {
    id: 'org-004',
    name: 'Tech Events UK',
    email: 'hello@techeventsuk.com',
    verificationStatus: 'pending',
    documentsSubmitted: true,
    totalEvents: 0,
    totalRevenue: 0,
    createdAt: '2026-01-13T10:15:00Z',
  },
  {
    id: 'org-005',
    name: 'Night Owls Ltd',
    email: 'bookings@nightowls.co.uk',
    verificationStatus: 'pending',
    documentsSubmitted: true,
    totalEvents: 0,
    totalRevenue: 0,
    createdAt: '2026-01-12T14:45:00Z',
  },
  {
    id: 'org-006',
    name: 'Family Events Co',
    email: 'info@familyevents.com',
    verificationStatus: 'unverified',
    documentsSubmitted: false,
    totalEvents: 0,
    totalRevenue: 0,
    createdAt: '2026-01-10T08:30:00Z',
  },
  {
    id: 'org-007',
    name: 'Scam Corp',
    email: 'fake@scamcorp.xyz',
    verificationStatus: 'rejected',
    documentsSubmitted: true,
    totalEvents: 0,
    totalRevenue: 0,
    createdAt: '2025-12-20T12:00:00Z',
  },
  {
    id: 'org-008',
    name: 'City Events Ltd',
    email: 'admin@cityevents.com',
    verificationStatus: 'verified',
    documentsSubmitted: true,
    totalEvents: 5,
    totalRevenue: 234500,
    createdAt: '2025-10-05T11:20:00Z',
    verifiedAt: '2025-10-08T09:45:00Z',
  },
  {
    id: 'org-009',
    name: 'Romance Events',
    email: 'contact@romanceevents.co.uk',
    verificationStatus: 'verified',
    documentsSubmitted: true,
    totalEvents: 3,
    totalRevenue: 45600,
    createdAt: '2025-11-12T16:00:00Z',
    verifiedAt: '2025-11-15T10:30:00Z',
  },
  {
    id: 'org-010',
    name: 'Elite Connections',
    email: 'vip@eliteconnections.com',
    verificationStatus: 'unverified',
    documentsSubmitted: false,
    totalEvents: 0,
    totalRevenue: 0,
    createdAt: '2026-01-15T09:00:00Z',
  },
];

// Detailed organizer data for verification
export interface OrganizerDetailForVerification extends AdminOrganizer {
  phone: string;
  website?: string;
  companyRegistration: string;
  taxId: string;
  address: {
    street: string;
    city: string;
    postcode: string;
    country: string;
  };
  documents: {
    id: string;
    type: 'business_license' | 'tax_document' | 'id_proof' | 'insurance';
    fileName: string;
    uploadedAt: string;
    status: 'pending' | 'approved' | 'rejected';
    url: string;
  }[];
  bankDetails: {
    accountName: string;
    sortCode: string;
    accountNumber: string;
  };
  notes?: string;
}

export const mockOrganizerDetailForVerification: OrganizerDetailForVerification = {
  id: 'org-003',
  name: 'Quick Rich Ltd',
  email: 'admin@quickrich.com',
  verificationStatus: 'pending',
  documentsSubmitted: true,
  totalEvents: 0,
  totalRevenue: 0,
  createdAt: '2026-01-14T15:30:00Z',
  phone: '+44 20 7946 0958',
  website: 'https://quickrich.com',
  companyRegistration: '12345678',
  taxId: 'GB123456789',
  address: {
    street: '123 Business Street',
    city: 'London',
    postcode: 'SW1A 1AA',
    country: 'United Kingdom',
  },
  documents: [
    {
      id: 'doc-001',
      type: 'business_license',
      fileName: 'business_license.pdf',
      uploadedAt: '2026-01-14T15:35:00Z',
      status: 'pending',
      url: '#',
    },
    {
      id: 'doc-002',
      type: 'tax_document',
      fileName: 'tax_registration.pdf',
      uploadedAt: '2026-01-14T15:36:00Z',
      status: 'pending',
      url: '#',
    },
    {
      id: 'doc-003',
      type: 'id_proof',
      fileName: 'directors_id.pdf',
      uploadedAt: '2026-01-14T15:37:00Z',
      status: 'pending',
      url: '#',
    },
  ],
  bankDetails: {
    accountName: 'Quick Rich Ltd',
    sortCode: '12-34-56',
    accountNumber: '12345678',
  },
  notes: 'New organizer, appears legitimate but requires thorough verification.',
};

// Filter organizers by status
export const mockPendingOrganizers = mockAdminOrganizers.filter(o => o.verificationStatus === 'pending');
export const mockVerifiedOrganizers = mockAdminOrganizers.filter(o => o.verificationStatus === 'verified');
export const mockUnverifiedOrganizers = mockAdminOrganizers.filter(o => o.verificationStatus === 'unverified');

// ============================================================================
// USER ACTIVITY DATA
// ============================================================================

import { UserActivity } from '../../app/types/admin';

export const mockUserActivities: UserActivity[] = [
  {
    id: 'act-001',
    userId: 'user-001',
    userName: 'Sarah Johnson',
    userEmail: 'sarah.johnson@email.com',
    type: 'login',
    action: 'User logged in',
    description: 'Successful login from Chrome on MacOS',
    timestamp: '2026-01-20T14:30:00Z',
    ipAddress: '82.45.123.45',
    location: 'London, UK',
    device: 'Desktop',
    browser: 'Chrome 120',
    os: 'MacOS 14.2',
    success: true,
  },
  {
    id: 'act-002',
    userId: 'user-003',
    userName: 'Emma Wilson',
    userEmail: 'emma.wilson@email.com',
    type: 'purchase',
    action: 'Ticket purchased',
    description: 'Purchased 2x General Admission tickets for Summer Music Festival',
    timestamp: '2026-01-20T14:15:00Z',
    ipAddress: '82.45.123.67',
    location: 'Edinburgh, UK',
    device: 'Mobile',
    browser: 'Safari 17',
    os: 'iOS 17.2',
    amount: 245.00,
    success: true,
  },
  {
    id: 'act-003',
    userId: 'user-009',
    userName: 'Lucas Anderson',
    userEmail: 'lucas.anderson@email.com',
    type: 'security',
    action: 'Failed login attempt',
    description: 'Incorrect password - 3rd attempt',
    timestamp: '2026-01-20T14:10:00Z',
    ipAddress: '195.74.88.23',
    location: 'Sheffield, UK',
    device: 'Mobile',
    browser: 'Chrome 120',
    os: 'Android 14',
    success: false,
    flagged: true,
  },
  {
    id: 'act-004',
    userId: 'user-003',
    userName: 'Emma Wilson',
    userEmail: 'emma.wilson@email.com',
    type: 'profile',
    action: 'Profile updated',
    description: 'Changed email address and phone number',
    timestamp: '2026-01-20T14:05:00Z',
    ipAddress: '82.45.123.89',
    location: 'Edinburgh, UK',
    device: 'Desktop',
    browser: 'Firefox 122',
    os: 'Windows 11',
    success: true,
  },
  {
    id: 'act-005',
    userId: 'user-004',
    userName: 'David Lee',
    userEmail: 'david.lee@email.com',
    type: 'suspicious',
    action: 'Suspicious activity detected',
    description: 'Attempted to purchase tickets from multiple accounts with same payment method',
    timestamp: '2026-01-20T14:00:00Z',
    ipAddress: '195.74.88.45',
    location: 'Manchester, UK',
    device: 'Desktop',
    browser: 'Chrome 120',
    os: 'Windows 11',
    success: false,
    flagged: true,
    severity: 'high',
  },
  {
    id: 'act-006',
    userId: 'user-006',
    userName: 'Sophie Martin',
    userEmail: 'sophie.martin@email.com',
    type: 'ticket',
    action: 'Ticket transferred',
    description: 'Transferred 1x VIP ticket to alice.jones@email.com',
    timestamp: '2026-01-20T13:55:00Z',
    ipAddress: '82.45.123.12',
    location: 'Birmingham, UK',
    device: 'Mobile',
    browser: 'Safari 17',
    os: 'iOS 17.2',
    success: true,
  },
  {
    id: 'act-007',
    userId: 'user-001',
    userName: 'Sarah Johnson',
    userEmail: 'sarah.johnson@email.com',
    type: 'logout',
    action: 'User logged out',
    description: 'Logged out from session',
    timestamp: '2026-01-20T13:45:00Z',
    ipAddress: '82.45.123.78',
    location: 'London, UK',
    device: 'Desktop',
    browser: 'Chrome 120',
    os: 'MacOS 14.2',
    success: true,
  },
  {
    id: 'act-008',
    userId: 'user-008',
    userName: 'Olivia Taylor',
    userEmail: 'olivia.taylor@email.com',
    type: 'purchase',
    action: 'Payment processed',
    description: 'Payment successful for 4x Standard tickets',
    timestamp: '2026-01-20T13:30:00Z',
    ipAddress: '82.45.123.90',
    location: 'Leeds, UK',
    device: 'Mobile',
    browser: 'Chrome 120',
    os: 'Android 14',
    amount: 180.00,
    success: true,
  },
  {
    id: 'act-009',
    userId: 'user-002',
    userName: 'Michael Chen',
    userEmail: 'michael.chen@email.com',
    type: 'login',
    action: 'User logged in',
    description: 'Successful login from Firefox on Windows',
    timestamp: '2026-01-20T13:15:00Z',
    ipAddress: '82.45.123.34',
    location: 'Bristol, UK',
    device: 'Desktop',
    browser: 'Firefox 122',
    os: 'Windows 11',
    success: true,
  },
  {
    id: 'act-010',
    userId: 'user-009',
    userName: 'Lucas Anderson',
    userEmail: 'lucas.anderson@email.com',
    type: 'purchase',
    action: 'Ticket purchased',
    description: 'Purchased 3x VIP tickets for Tech Conference London',
    timestamp: '2026-01-20T13:00:00Z',
    ipAddress: '82.45.123.23',
    location: 'Sheffield, UK',
    device: 'Desktop',
    browser: 'Edge 120',
    os: 'Windows 11',
    amount: 567.00,
    success: true,
  },
  {
    id: 'act-011',
    userId: 'user-006',
    userName: 'Sophie Martin',
    userEmail: 'sophie.martin@email.com',
    type: 'profile',
    action: 'Password changed',
    description: 'User successfully changed account password',
    timestamp: '2026-01-20T12:45:00Z',
    ipAddress: '82.45.123.56',
    location: 'Birmingham, UK',
    device: 'Mobile',
    browser: 'Safari 17',
    os: 'iOS 17.2',
    success: true,
  },
  {
    id: 'act-012',
    userId: 'user-004',
    userName: 'David Lee',
    userEmail: 'david.lee@email.com',
    type: 'security',
    action: 'Account suspended',
    description: 'Account suspended for violating terms of service',
    timestamp: '2026-01-20T12:30:00Z',
    ipAddress: '82.45.123.99',
    location: 'Manchester, UK',
    device: 'Desktop',
    browser: 'Chrome 120',
    os: 'Windows 11',
    success: true,
    flagged: true,
    severity: 'high',
  },
];

// Activity stats
export const mockActivityStats = {
  totalActivities: 12847,
  activeNow: 342,
  activeChange: 8.3,
  loginAttempts: 1247,
  loginChange: 12.5,
  purchases: 156,
  purchaseChange: 15.7,
  suspiciousActivity: 8,
  suspiciousChange: -23.4,
};

// Detailed user data
export const mockUserDetail: UserDetail = {
  id: 'user-001',
  email: 'sarah.johnson@email.com',
  name: 'Sarah Johnson',
  role: 'user',
  isAdmin: false,
  isSuspended: false,
  createdAt: '2025-11-15T10:30:00Z',
  lastLogin: '2026-01-15T14:22:00Z',
  totalSpent: 234.50,
  ticketsPurchased: 8,
  phone: '+44 7700 900123',
  location: 'London, UK',
  joinedDate: '2025-11-15T10:30:00Z',
  emailVerified: true,
  phoneVerified: true,
  twoFactorEnabled: false,
  orders: [
    {
      id: 'order-001',
      eventName: 'Summer Music Festival 2026',
      eventDate: '2026-07-15T18:00:00Z',
      quantity: 2,
      amount: 100.00,
      status: 'completed',
      purchasedAt: '2026-01-10T14:30:00Z',
    },
    {
      id: 'order-002',
      eventName: 'Tech Conference London',
      eventDate: '2026-03-22T09:00:00Z',
      quantity: 1,
      amount: 89.50,
      status: 'completed',
      purchasedAt: '2026-01-08T11:20:00Z',
    },
    {
      id: 'order-003',
      eventName: 'Comedy Night Live',
      eventDate: '2026-02-14T20:00:00Z',
      quantity: 1,
      amount: 45.00,
      status: 'completed',
      purchasedAt: '2026-01-05T16:45:00Z',
    },
  ],
  favoriteEvents: [
    {
      id: 'evt-101',
      name: 'New Year Celebration 2026',
      date: '2026-01-31T20:00:00Z',
    },
    {
      id: 'evt-102',
      name: 'Valentine\'s Concert',
      date: '2026-02-14T19:00:00Z',
    },
  ],
  activityLog: [
    {
      id: 'log-001',
      action: 'Logged in',
      timestamp: '2026-01-15T14:22:00Z',
      ipAddress: '82.45.123.45',
      device: 'Chrome on MacOS',
    },
    {
      id: 'log-002',
      action: 'Purchased tickets',
      timestamp: '2026-01-10T14:30:00Z',
      ipAddress: '82.45.123.45',
      device: 'Safari on iOS',
    },
    {
      id: 'log-003',
      action: 'Updated profile',
      timestamp: '2026-01-08T09:15:00Z',
      ipAddress: '82.45.123.45',
      device: 'Chrome on MacOS',
    },
  ],
  paymentMethods: [
    {
      id: 'pm-001',
      type: 'card',
      last4: '4242',
      brand: 'Visa',
      expiryMonth: 12,
      expiryYear: 2027,
      isDefault: true,
    },
  ],
};