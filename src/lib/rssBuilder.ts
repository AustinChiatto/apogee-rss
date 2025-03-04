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
 * renders a section with a heading only if at least one of its items has content
 * @param title the section heading
 * @param content the section content
 * @returns html string or empty string
 */
function renderSection(title: string, content: string): string {
  return content.trim() ? `<h2>${title}</h2>${content}` : '';
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
    <p>
      ${renderIf(missionDetails.type, (type) => `<strong>Mission Type</strong> - ${type}<br />`)}
      
      ${renderIf(missionDetails.orbitName, (orbit) => `<strong>Mission Destination</strong> - ${orbit}<br />`)}
      
      ${renderIf(missionDetails.padName, (pad) => `<strong>Launch site</strong> - ${pad}`)}
    </p>
    
    ${renderIf(missionDetails.desc, (desc) => `<p>${truncate(desc, 310)}</p>`)}
    
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

  // vehicle details content
  const rocketContent = renderIf(
    rocketDetails,
    (rocket) => `
    ${renderIf(rocket.fullName, (name) => `<h3>${name}</h3>`)}
    
    ${renderIf(rocket.image_url, (img) => `<img src="${img}" alt="Rocket image" style="max-width:100%; height:auto;" />`)}
    
    ${renderIf(rocket.desc, (desc) => `<p>${truncate(desc, 310)}</p>`)}
    
    <h3>Vehicle Stats</h3>
    <p>
      ${renderIf(rocket.length, (len) => `<strong>Length</strong> - ${len} m<br />`)}
      ${renderIf(rocket.diameter, (dia) => `<strong>Diameter</strong> - ${dia} m<br />`)}
      ${renderIf(rocket.launchCost, (cost) => `<strong>Launch Mass</strong> - ${cost}<br />`)}
      ${renderIf(rocket.capacityLeo, (leo) => `<strong>LEO Capacity</strong> - ${leo}<br />`)}
      ${renderIf(rocket.capacityGto, (gto) => `<strong>GTO Capacity</strong> - ${gto}<br />`)}
      ${renderIf(rocket.thrustTo, (thrust) => `<strong>Thrust</strong> - ${thrust} kN`)}
    </p>
    
    <h3>Vehicle Launch Record</h3>
    <p>
      ${renderIf(rocket.launchSuccessCount, (count) => `<strong>Successful Launches</strong> - ${count}<br />`)}
      ${renderIf(rocket.launchFailedCount, (count) => `<strong>Failed Launches</strong> - ${count}<br />`)}
      ${renderIf(rocket.landingSuccessCount, (count) => `<strong>Successful Landings</strong> - ${count}<br />`)}
      ${renderIf(rocket.landingFailedCount, (count) => `<strong>Failed Landings</strong> - ${count}`)}
    </p>
    <br />
  `
  );

  // provider details content
  const providerContent = renderIf(
    providerDetails,
    (provider) => `
    ${renderIf(provider.name, (name) => `<h3>${name}</h3>`)}
    
    ${renderIf(
      provider.desc,
      (desc) => `
      <p>
        ${truncate(desc, 310)} 
        ${renderIf(provider.info_url, (url) => `<a href="${url}">Read More</a>`)}
      </p>
    `
    )}
    
    <h3>Agency Details</h3>
    <p>
      ${renderIf(provider.administrator, (admin) => `<strong>Administrator</strong> - ${admin}<br />`)}
      ${renderIf(provider.type, (type) => `<strong>Type</strong> - ${type}<br />`)}
      ${renderIf(provider.foundingYear, (year) => `<strong>Founding Year</strong> - ${year}<br />`)}
      ${renderIf(provider.launchers, (launchers) => `<strong>Launchers</strong> - ${launchers}<br />`)}
      ${renderIf(provider.spacecraft, (spacecraft) => `<strong>Spacecraft</strong> - ${spacecraft}`)}
    </p>
    
    ${renderIf(
      provider.name,
      (name) => `
      <h3>${name} Launch Record</h3>
      <p>
        ${renderIf(provider.launchSuccessCount, (count) => `<strong>Successful Launches</strong> - ${count}<br />`)}
        ${renderIf(provider.launchFailedCount, (count) => `<strong>Failed Launches</strong> - ${count}<br />`)}
        ${renderIf(provider.landingSuccessCount, (count) => `<strong>Successful Landings</strong> - ${count}<br />`)}
        ${renderIf(provider.landingFailedCount, (count) => `<strong>Failed Landings</strong> - ${count}`)}
      </p>
    `
    )}
  `
  );

  return `
    ${headerSection}
    ${renderSection('Mission Details', missionContent)}
    ${renderSection('Launch Vehicle', rocketContent)}
    ${renderSection('Launch Provider', providerContent)}
  `;
}
