import { createFilteredFeed } from '@/lib/rss/createFilteredFeed';
import { Mission } from '@/types/missionProps';

// returns all missions unchanged - no filter
function allMissions(missions: Mission[]): Mission[] {
  return missions;
}

export async function GET() {
  return createFilteredFeed(allMissions, 'Upcoming Launches', 'Stay up to date with all upcoming rocket launches', 'rss');
}
