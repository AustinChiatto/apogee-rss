import { Mission } from '@/types/missionProps';
import { getMissionDetails, getProviderDetails, getVehicleDetails } from '@/lib/missionUtils';
import { buildMissionSection } from './sections/missionSection';
import { buildVehicleSection } from './sections/vehicleSection';
import { buildProviderSection } from './sections/providerSection';

/**
 * builds a complete html description for an rss item from mission data
 * @param mission the mission data
 * @returns html string for RSS item description
 */
export function buildRssItemDescription(mission: Mission): string {
  const missionDetails = getMissionDetails(mission);
  const rocketDetails = getVehicleDetails(mission.rocket);
  const providerDetails = getProviderDetails(mission.launch_service_provider);

  // Build each section using specialized builders
  const missionSection = buildMissionSection(mission, missionDetails);
  const vehicleSection = buildVehicleSection(mission, rocketDetails);
  const providerSection = buildProviderSection(mission, providerDetails);

  const creditLine = `
<br />
<br />
<p>---</p>
<br />
<p style="font-size: 0.8em; color: #666;">
  Data provided by <a href="https://thespacedevs.com/llapi">Launch Library 2</a> API from 
  <a href="https://thespacedevs.com/">The Space Devs</a>. 
  Licensed under Apache License 2.0.
</p>
`;

  return `
    ${missionSection}
    ${vehicleSection}
    ${providerSection}
		${creditLine}
`;
}
