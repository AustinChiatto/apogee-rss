import { Mission } from '@/types/missionProps';

/**
 * Filters out Starlink missions
 * @param missions Array of missions to filter
 * @returns Missions that are not Starlink
 */
export function excludeStarlink(missions: Mission[]): Mission[] {
  return missions.filter((mission) => {
    const missionName = mission.name?.toLowerCase() || '';
    const missionDesc = mission.mission?.description?.toLowerCase() || '';

    return !missionName.includes('starlink') && !missionDesc.includes('starlink');
  });
}

/**
 * Filters for only Starship missions
 * @param missions Array of missions to filter
 * @returns Only Starship missions
 */
export function onlyStarship(missions: Mission[]): Mission[] {
  return missions.filter((mission) => {
    const rocketName = mission.rocket?.configuration?.name?.toLowerCase() || '';
    const rocketFullName = mission.rocket?.configuration?.full_name?.toLowerCase() || '';
    const missionName = mission.name?.toLowerCase() || '';

    return rocketName.includes('starship') || rocketFullName.includes('starship') || missionName.includes('starship');
  });
}
