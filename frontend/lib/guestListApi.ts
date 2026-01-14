'use client';

// Guest List API Service
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface Guest {
  id: string;
  name: string;
  email: string;
  mobile?: string;
  category: 'VIP' | 'INDUSTRY' | 'COMP' | 'STAFF' | 'PRESS' | 'SPONSOR';
  status: 'INVITED' | 'CONFIRMED' | 'DECLINED' | 'CHECKED_IN';
  ticketCode: string;
  ticketLink: string;
  notes?: string;
  invitedAt?: string;
  confirmedAt?: string;
  checkedInAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface GuestListResponse {
  guests: Guest[];
  maxGuests: number | null;
  currentCount: number;
}

export interface CreateGuestData {
  name: string;
  email: string;
  mobile?: string;
  category: 'VIP' | 'INDUSTRY' | 'COMP' | 'STAFF' | 'PRESS' | 'SPONSOR';
  notes?: string;
}

const guestListApi = {
  async getGuestList(eventId: string): Promise<GuestListResponse> {
    const response = await fetch(`${API_BASE_URL}/events/${eventId}/guests`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch guest list');
    }

    return response.json();
  },

  async addGuest(eventId: string, guestData: CreateGuestData): Promise<Guest> {
    const response = await fetch(`${API_BASE_URL}/events/${eventId}/guests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(guestData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to add guest');
    }

    return response.json();
  },

  async deleteGuest(eventId: string, guestId: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/events/${eventId}/guests/${guestId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete guest');
    }
  },

  async sendInvitation(eventId: string, guestId: string): Promise<{ message: string; sentTo: string }> {
    const response = await fetch(`${API_BASE_URL}/events/${eventId}/guests/${guestId}/send-invitation`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to send invitation');
    }

    return response.json();
  },
};

export default guestListApi;