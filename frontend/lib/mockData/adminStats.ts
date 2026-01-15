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