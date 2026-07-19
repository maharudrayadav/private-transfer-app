import { API_BASE_URL } from '@/lib/api';

export class PaymentService {
  /**
   * Fetches booking details for a given reservation code.
   * @param code The reservation code (e.g. AB12345)
   */
  static async getBookingByCode(code: string): Promise<any> {
    const res = await fetch(`${API_BASE_URL}/api/bookings/code/${code.toUpperCase()}`);
    if (!res.ok) {
      throw new Error('Reservation not found. Please check your code.');
    }
    return res.json();
  }
}

