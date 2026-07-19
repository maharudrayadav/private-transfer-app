import { API_BASE_URL } from '@/lib/api';

export class DashboardService {
  /**
   * Fetches all bookings matching filtering and pagination parameters.
   * @param params URLSearchParams search filter query parameters
   */
  static async fetchBookings(params: URLSearchParams): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/api/bookings?${params.toString()}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch bookings: ${res.status}`);
    }
    return res.json();
  }

  /**
   * Approves/Confirms a booking and assigns drivers.
   */
  static async confirmBooking(payload: {
    bookingId: number;
    driverName: string;
    returnDriverName: string | null;
    returndriverName: string | null;
  }): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/api/admin/confirm-booking`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      throw new Error(`Failed to confirm booking: ${res.status}`);
    }
    return res.text();
  }

  /**
   * Fetches direct booking details from the backend source.
   */
  static async fetchBookingDetails(id: number): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/api/bookings/${id}`);
    if (!res.ok) {
      throw new Error(`Failed to fetch booking details: ${res.status}`);
    }
    return res.json();
  }

  /**
   * Updates an existing booking's records.
   */
  static async updateBooking(id: number, payload: any): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/api/bookings/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });
    if (!res.ok) {
      throw new Error(`Failed to update booking: ${res.status}`);
    }
    return res.json();
  }
}
