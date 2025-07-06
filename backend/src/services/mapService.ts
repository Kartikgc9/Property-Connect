import { Property } from '@prisma/client';
import axios from 'axios';
import { logger } from '../middleware/logger';

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

export const mapService = {
  async enrichWithLocalInsights(property: Property) {
    try {
      if (!GOOGLE_MAPS_API_KEY) {
        logger.warn('Google Maps API key missing – skipping local insight enrichment');
        return;
      }

      // Example: fetch school data or commute times (placeholder)
      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${property.coordinates.lat},${property.coordinates.lng}&radius=2000&type=school&key=${GOOGLE_MAPS_API_KEY}`;
      await axios.get(url);

      logger.debug(`Fetched basic local insights for property ${property.id}`);
    } catch (err) {
      logger.error('Local insights fetch failed', err);
    }
  },
};