import { Mission } from '@/types/missionProps';
import { getMissionDetails, getProviderDetails, getVehicleDetails } from '@/lib/missionUtils';

/**
 * truncates text to a specified length and adds ellipsis
 * @param text text to truncate
 * @param maxCharacters maximum number of characters before truncation
 * @returns truncated text with ellipsis or original text if short enough
 */
export function truncate(text: string, maxCharacters: number): string {
  if (!text || text.length <= maxCharacters) {
    return text || '';
  }
  return text.slice(0, maxCharacters) + '...';
}

/**
 * conditionally renders html only if the value exists
 * @param value the value to check
 * @param render function that returns html string when value exists
 * @returns html string or empty string
 */
export function renderIf<T>(value: T | null | undefined, render: (val: T) => string): string {
  // return empty or null
  if (value === null || value === undefined || value === '' || (Array.isArray(value) && value.length === 0)) {
    return '';
  }
  return render(value);
}

/**
 * renders a section only if its content is not empty
 * @param content the section content
 * @returns html string or empty string
 */
function renderSection(content: string): string {
  return content.trim() ? content : '';
}

/**
 * builds a complete html description for an rss item from mission data
 * @param mission the mission data
 * @returns html string for RSS item description
 */
export function buildRssItemDescription(mission: Mission): string {
  const missionDetails = getMissionDetails(mission);
  const rocketDetails = getVehicleDetails(mission.rocket);
  const providerDetails = getProviderDetails(mission.launch_service_provider);

  // mission image and basic info
  const headerSection = `
    ${renderIf(
      mission.image,
      (img) =>
        `<img src="${img}" alt="Launch image" style="max-width:100%; height:auto;" />
       <br />`
    )}
    
    ${renderIf(missionDetails.statusName, (status) => `<p><strong>Launch Status</strong>: ${status}</p>`)}
    
    ${renderIf(
      missionDetails.net,
      (time) =>
        `<p><strong>Launch Time</strong>: ${time}</p>
       <br />`
    )}
  `;

  // mission details content
  const missionContent = `
		<h2>Mission Details</h2>
    <p>
      ${renderIf(missionDetails.type, (type) => `<strong>Type:</strong> ${type}<br />`)}
			${renderIf(
        missionDetails.orbitName,
        (orbit) => `
				<strong>Destination:</strong> ${orbit}
				${renderIf(missionDetails.orbitDesc, (desc) => ` - ${desc}`)}
				<br />
			`
      )}			
      ${renderIf(missionDetails.padName, (pad) => `<strong>Launch site: </strong><a href="${missionDetails.mapUrl}">${pad}</a>`)}
			${renderIf(
        mission.rocket?.launcher_stage?.[0]?.landing,
        (landing) => `
				<br /><strong>Landing site:</strong> ${
          landing.attempt ? (landing.success !== null ? (landing.success ? 'Successful' : 'Failed') : 'Attempted') : 'No attempt'
        }
				${renderIf(landing.location?.name, (name) => ` on ${name}`)}
			`
      )}
    </p>
    
    ${renderIf(missionDetails.desc, (desc) => `<p>${truncate(desc, 310)}</p><br />`)}
    
    ${renderIf(
      missionDetails.vidUrl,
      (url) => `
      <a href="${url}">
        <img 
          src="${missionDetails.vidThumb ?? '/image-placeholder.jpg'}" 
          alt="Launch video thumbnail" 
          style="max-width:100%; height:auto;" 
        />
      </a>
      <br />`
    )}
  `;

  // rocket details content
  const rocketContent = renderIf(rocketDetails, (rocket) => {
    const booster = mission.rocket?.launcher_stage?.[0];

    // Check if there are any launch or landing attempts
    const hasLaunchAttempts = (rocket.launchSuccessCount || 0) + (rocket.launchFailedCount || 0) > 0;
    const hasLandingAttempts = (rocket.landingSuccessCount || 0) + (rocket.landingFailedCount || 0) > 0;

    return `
    <h2>Launch Vehicle - ${rocket.fullName || 'Unknown'}</h2>
    ${renderIf(rocket.image_url, (img) => `<img src="${img}" alt="Rocket image" style="max-width:100%; height:auto;" />`)}
    ${renderIf(rocket.desc, (desc) => `<p>${truncate(desc, 310)}</p>`)}
		${renderIf(
      rocket.info_url,
      (url) => `
      <p><a href="${url}">Learn more about ${rocket.fullName || 'this vehicle'}</a></p>
    `
    )}
    ${renderIf(
      booster,
      (stage) => `
      <h3>Booster Information</h3>
      <p>
        ${renderIf(stage.launcher?.serial_number, (serial) => `<strong>Booster:</strong> ${serial}<br />`)}
        ${renderIf(
          stage.reused !== null,
          () =>
            `<strong>Reused:</strong> ${stage.reused ? 'Yes' : 'No'}${
              stage.launcher_flight_number ? ` (Flight ${stage.launcher_flight_number})` : ''
            }<br />`
        )}
      </p>
    `
    )}
    
    <h3>Vehicle Stats</h3>
    <p>
      ${renderIf(rocket.length, (len) => `<strong>Length:</strong> ${len} m<br />`)}
      ${renderIf(rocket.diameter, (dia) => `<strong>Diameter:</strong> ${dia} m<br />`)}
      ${renderIf(rocket.launchMass, (mass) => `<strong>Launch Mass:</strong> ${mass} tons<br />`)}
      ${renderIf(rocket.launchCost, (cost) => `<strong>Launch Cost:</strong> $${parseInt(cost).toLocaleString()}<br />`)}
      ${renderIf(rocket.capacityLeo, (leo) => `<strong>LEO Capacity:</strong> ${leo} kg<br />`)}
      ${renderIf(rocket.capacityGto, (gto) => `<strong>GTO Capacity:</strong> ${gto} kg<br />`)}
      ${renderIf(rocket.thrustTo, (thrust) => `<strong>Thrust:</strong> ${thrust} kN`)}
    </p>
    
    <h3>Vehicle Launch Record</h3>
   <p>
      ${
        !hasLaunchAttempts
          ? `<strong>Launch Attempts:</strong> ${rocket.launchSuccessCount}<br />`
          : `${renderIf(rocket.launchSuccessCount, (count) => `<strong>Successful Launches:</strong> ${count}<br />`)}
         ${renderIf(rocket.launchFailedCount, (count) => `<strong>Failed Launches:</strong> ${count}<br />`)}`
      }
      
      ${
        !hasLandingAttempts
          ? `<strong>Landing Attempts:</strong> ${rocket.landingSuccessCount}`
          : `${renderIf(rocket.landingSuccessCount, (count) => `<strong>Successful Landings:</strong> ${count}<br />`)}
         ${renderIf(rocket.landingFailedCount, (count) => `<strong>Failed Landings:</strong> ${count}`)}`
      }
    </p>
    <br />
  `;
  });

  // provider details content
  const providerContent = renderIf(
    providerDetails,
    (provider) => `
    <h2>Launch Provider ${provider.name ? `- ${provider.name}` : ''}</h2>
    
    ${renderIf(
      provider.desc,
      (desc) => `
      <p>${truncate(desc, 310)}</p>
    `
    )}

		${renderIf(
      provider.name,
      (url) => `
      <p><a href="${url}">Discover more of ${provider.name}</a></p>
    `
    )}
    
    <h3>Agency Details</h3>
    <p>
      ${renderIf(provider.administrator, (admin) => `<strong>Administrator:</strong> ${admin}<br />`)}
      ${renderIf(provider.type, (type) => `<strong>Type:</strong> ${type}<br />`)}
      ${renderIf(provider.foundingYear, (year) => `<strong>Founding Year:</strong> ${year}<br />`)}
      ${renderIf(provider.launchers, (launchers) => `<strong>Launchers:</strong> ${launchers}<br />`)}
      ${renderIf(provider.spacecraft, (spacecraft) => `<strong>Spacecraft:</strong> ${spacecraft}`)}
    </p>
    
    ${renderIf(
      provider.name,
      (name) => `
      <h3>${name} Launch Record</h3>
      <p>
        ${renderIf(provider.launchSuccessCount, (count) => `<strong>Successful Launches:</strong> ${count}<br />`)}
        ${renderIf(provider.launchFailedCount, (count) => `<strong>Failed Launches:</strong> ${count}<br />`)}
        ${renderIf(provider.landingSuccessCount, (count) => `<strong>Successful Landings:</strong> ${count}<br />`)}
        ${renderIf(provider.landingFailedCount, (count) => `<strong>Failed Landings:</strong> ${count}`)}
      </p>
    `
    )}
  `
  );

  return `
  ${headerSection}
  ${renderSection(`
    ${missionContent}
  `)}
  ${renderSection(`
    
    ${rocketContent}
  `)}
  ${renderSection(`
    ${providerContent}
  `)}
`;
}
