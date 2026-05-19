export class GalleryService {
  /**
   * Fetches all images categorized for the gallery.
   */
  static async getGalleryImages(): Promise<any[]> {
    const res = await fetch('/api/images?service=gallery');
    if (!res.ok) {
      throw new Error('Failed to fetch gallery images');
    }
    return res.json();
  }
}
