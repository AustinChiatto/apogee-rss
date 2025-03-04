import { onlyStarship } from '@/lib/rss/utils/filterMissions';
import { createFilteredFeed } from '@/lib/createFilteredFeed';

export async function GET() {
  return createFilteredFeed(
    onlyStarship,
    'Upcoming Starship Launches',
    'Stay up to date with upcoming Starship launches',
    'rss-starship'
  );
}
