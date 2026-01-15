import { NextResponse } from "next/server";

export async function GET() {
  // Temporary safe empty response (so dashboard renders without mock data)
  return NextResponse.json({
    kpis: {
      revenue: 0,
      ticketsSold: 0,
      upcomingEvents: 0,
      refunds: 0,
    },
    recentOrders: [],
    upcomingEvents: [],
    alerts: [],
  });
}
