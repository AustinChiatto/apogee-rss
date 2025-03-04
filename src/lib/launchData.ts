import { Mission } from '@/types/missionProps';

// cache fetched data
let cachedData: Mission[];
let lastFetchTime: number = 0;
const CACHE_DURATION = 3600000;

/**
 * Fetches launch data from the API, with caching
 * @param forceRefresh Whether to force a refresh regardless of cache
 * @returns Array of missions
 */
export async function getUpcomingMissions(forceRefresh = false): Promise<Mission[]> {
  const now = Date.now();

  // return cached data if it's fresh enough
  if (!forceRefresh && cachedData && lastFetchTime > 0 && now - lastFetchTime < CACHE_DURATION) {
    console.log('Using cached launch data from', new Date(lastFetchTime).toISOString());
    return cachedData;
  }

  // else fetch fresh data
  console.log('Fetching fresh launch data...');

  try {
    const res = await fetch('https://ll.thespacedevs.com/2.2.0/launch/upcoming/?mode=detailed', {
      cache: 'no-store',
      headers: {
        'User-Agent': 'Apogee-RSS-Feed/1.0'
      }
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch: ${res.status} ${res.statusText}`);
    }

    const data = await res.json();

    // update cache
    cachedData = data.results || [];
    lastFetchTime = now;

    return cachedData;
  } catch (error) {
    console.error('Error fetching launch data:', error);

    // if cached data exists, return it as fallback even if it's stale
    if (cachedData) {
      console.log('Returning stale cached data as fallback');
      return cachedData;
    }

    // else re-throw the error
    throw error;
  }
}
