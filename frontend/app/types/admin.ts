// ============================================================================
// ADMIN DASHBOARD TYPES
// ============================================================================

// Platform Overview Stats
export interface PlatformStats {
  totalUsers: number;
  totalOrganizers: number;
  totalArtists: number;
  totalRevenue: number;
  changeVsPrevious: {
    users: number;
    organizers: number;
    artists: number;
    revenue: number;
  };
}

// Alerts requiring attention
export interface Alert {
  id: string;
  type: 'event_approval' | 'organizer_verification' | 'support_ticket' | 'dispute';
  count: number;
  message: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  link: string;
}

// Chart data points
export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
}

// Popular items (events, organizers, artists)
export interface PopularEvent {
  id: string;
  name: string;
  ticketsSold: number;
  revenue: number;
  date: string;
}

export interface PopularOrganizer {
  id: string;
  name: string;
  totalEvents: number;
  revenue: number;
  eventsCount: number;
}

export interface PopularArtist {
  id: string;
  name: string;
  eventsCount: number;
  ticketsSold: number;
  totalRevenue: number;
}

// Activity feed item
export interface ActivityItem {
  id: string;
  type: 'event_created' | 'user_signup' | 'ticket_purchased' | 'payout_processed' | 'support_ticket' | 'event_approved';
  message: string;
  timestamp: string;
  userId?: string;
  userName?: string;
  metadata?: Record<string, any>;
}

// User Management
export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'organizer' | 'artist' | 'admin';
  isAdmin: boolean;
  isSuspended: boolean;
  suspensionReason?: string;
  createdAt: string;
  lastLogin?: string;
  totalSpent?: number;
  ticketsPurchased?: number;
}

// Event Management
export interface AdminEvent {
  id: string;
  title: string;
  organizerId: string;
  organizerName: string;
  approvalStatus: 'draft' | 'pending_approval' | 'approved' | 'rejected' | 'live' | 'ended';
  flaggedReasons?: string[];
  submittedAt?: string;
  approvedAt?: string;
  approvedBy?: string;
  rejectionReason?: string;
  ticketsSold: number;
  revenue: number;
  date: string;
  venue: string;
}

// Event detail for review page (extends AdminEvent)
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

// Organizer Management
export interface AdminOrganizer {
  id: string;
  name: string;
  email: string;
  verificationStatus: 'unverified' | 'pending' | 'verified' | 'rejected';
  documentsSubmitted: boolean;
  totalEvents: number;
  totalRevenue: number;
  createdAt: string;
  verifiedAt?: string;
}

// Support Tickets
export interface SupportTicket {
  id: string;
  ticketNumber: string;
  userId: string;
  userName: string;
  userEmail: string;
  subject: string;
  category: 'technical' | 'billing' | 'event' | 'account' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'waiting_response' | 'resolved' | 'closed';
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  resolvedBy?: string;
  messagesCount: number;
}

export interface SupportMessage {
  id: string;
  ticketId: string;
  senderId: string;
  senderName: string;
  senderRole: 'user' | 'admin';
  message: string;
  isInternalNote: boolean;
  createdAt: string;
  attachments?: string[];
}

// Financial Data
export interface FinancialOverview {
  totalRevenue: number;
  platformFees: number;
  stripeFees: number;
  netRevenue: number;
  pendingPayouts: number;
  completedPayouts: number;
  period: {
    start: string;
    end: string;
  };
}

export interface Payout {
  id: string;
  organizerId: string;
  organizerName: string;
  amount: number;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'held';
  scheduledFor: string;
  completedAt?: string;
  eventIds: string[];
  stripePayoutId?: string;
}

// Analytics
export interface PlatformAnalytics {
  revenueData: ChartDataPoint[];
  eventCreationData: ChartDataPoint[];
  userGrowthData: ChartDataPoint[];
  period: {
    start: string;
    end: string;
  };
}

// Admin Settings
export interface PlatformSettings {
  commissionRate: number; // Percentage (e.g., 5 for 5%)
  maxTicketPrice: number;
  minTicketPrice: number;
  resaleCap: number; // Percentage (e.g., 110 for 110%)
  autoApproveEvents: boolean;
  maintenanceMode: boolean;
  flaggedKeywords: string[];
}

// Admin Activity Log
export interface AdminActivityLog {
  id: string;
  adminId: string;
  adminName: string;
  action: string;
  entityType: 'user' | 'event' | 'organizer' | 'payout' | 'setting';
  entityId: string;
  details: Record<string, any>;
  ipAddress: string;
  createdAt: string;
}