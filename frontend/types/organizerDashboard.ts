import type { LucideIcon } from 'lucide-react';

export type WarningType = 'warning' | 'info' | 'success';
export type WarningPriority = 'high' | 'medium' | 'low';
export type EventStatus = 'On Sale' | 'Draft' | 'Off Sale' | string;

export type ActivityType = 'sale' | 'transfer' | 'refund' | string;

export interface RevenuePoint {
  date: string; // e.g. "Nov 1" or ISO date; your choice
  revenue: number;
  tickets?: number;
}

export interface FanHealthPoint {
  month: string; // e.g. "Jun"
  retention: number;
  engagement: number;
}

export interface UpcomingEvent {
  id: number | string;
  name: string;
  date: string; // ISO date recommended
  time?: string; // "18:00"
  venue?: string;
  ticketsSold: number;
  totalTickets: number;
  revenue: number;
  status: EventStatus;
}

export interface RecentActivityItem {
  type: ActivityType;
  event: string;
  tickets: number;
  time: string; // "2 minutes ago" or ISO time; your choice
  amount?: number;
}

export interface WarningItem {
  type: WarningType;
  priority: WarningPriority;
  title: string;
  description: string;
  action: string;
  actionLink: string;
}

export interface MarketingSuggestion {
  // In payload, send iconKey (string), not the icon component
  iconKey: 'Mail' | 'Share2' | 'Target' | string;
  title: string;
  description: string;
  action: string;
}

export interface OrganizerDashboardPayload {
  organizerName?: string;

  stats: {
    totalEvents: number;
    ticketsSold: number;
    totalRevenue: number;
    availablePayout: number;
    activeFans?: number;
    revenueTrendPct?: number;
    ticketsTrendPct?: number;
    fansTrendPct?: number;
  };

  revenueData: RevenuePoint[];
  fanHealthData: FanHealthPoint[];

  upcomingEvents: UpcomingEvent[];
  recentActivity: RecentActivityItem[];
  warnings: WarningItem[];
  marketingSuggestions: MarketingSuggestion[];
}
