import { API_BASE_URL } from '@/lib/api';

export class GalleryService {
  /**
   * Fetches all images categorized for the gallery.
   */
  static async getGalleryImages(): Promise<any[]> {
    const res = await fetch(API_BASE_URL + '/api/images?service=gallery');
    if (!res.ok) {
      throw new Error('Failed to fetch gallery images');
    }
    return res.json();
  }
}

