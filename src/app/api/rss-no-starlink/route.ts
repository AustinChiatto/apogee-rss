import { excludeStarlink } from '@/lib/rss/utils/filterMissions';
import { createFilteredFeed } from '@/lib/createFilteredFeed';

export async function GET() {
  return createFilteredFeed(
    excludeStarlink,
    'Upcoming Launches (No Starlink)',
    'Stay up to date with the latest rocket launches, excluding Starlink missions',
    'rss-no-starlink'
  );
}
