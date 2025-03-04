import { Mission } from '@/types/missionProps';
import { getMissionDetails, getProviderDetails, getVehicleDetails } from '@/lib/missionUtils';

export function truncate(text: string, maxCharacters: number): string {
  if (!text || text.length <= maxCharacters) {
    return text || '';
  }
  return text.slice(0, maxCharacters) + '...';
}

// renders html only if value exists
export function renderIf<T>(value: T | null | undefined, render: (val: T) => string): string {
  // return empty or null
  if (value === null || value === undefined || value === '' || (Array.isArray(value) && value.length === 0)) {
    return '';
  }
  return render(value);
}

// custom rss item description
export function buildRssItemDescription(mission: Mission): string {
  const missionDetails = getMissionDetails(mission);
  const rocketDetails = getVehicleDetails(mission.rocket);
  const providerDetails = getProviderDetails(mission.launch_service_provider);

  return `
    ${renderIf(
      missionDetails.image,
      (img) => `
      <img src="${img}" alt="Launch image" style="max-width:100%; height:auto;" />
      <br />
    `
    )}
    
    ${renderIf(
      missionDetails.statusName,
      (status) => `
      <p><strong>Launch Status</strong>: ${status}</p>
    `
    )}
    
    ${renderIf(
      missionDetails.net,
      (time) => `
      <p><strong>Launch Time</strong>: ${time}</p>
      <br />
    `
    )}
    
    <h2>Mission Details</h2>
    <p>
      ${renderIf(
        missionDetails.type,
        (type) => `
        <strong>Mission Type</strong> - ${type}<br />
      `
      )}
      
      ${renderIf(
        missionDetails.orbitName,
        (orbit) => `
        <strong>Mission Destination</strong> - ${orbit}<br />
      `
      )}
      
      ${renderIf(
        missionDetails.padName,
        (pad) => `
        <strong>Launch site</strong> - ${pad}
      `
      )}
    </p>
    
    ${renderIf(
      missionDetails.desc,
      (desc) => `
      <p>${truncate(desc, 310)}</p>
    `
    )}
    
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
      <br />
    `
    )}
    
    ${renderIf(
      rocketDetails.fullName,
      (name) => `
      <h2>${name} Launch Vehicle</h2>
      
      ${renderIf(
        rocketDetails.image_url,
        (img) => `
        <img src="${img}" alt="Rocket image" style="max-width:100%; height:auto;" />
      `
      )}
      
      ${renderIf(
        rocketDetails.desc,
        (desc) => `
        <p>${truncate(desc, 310)}</p>
      `
      )}
    `
    )}
    
    ${renderIf(
      rocketDetails,
      (rocket) => `
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
    )}
    
    ${renderIf(
      providerDetails.name,
      (name) => `
      <h2>${name}</h2>
      
      ${renderIf(
        providerDetails.desc,
        (desc) => `
        <p>
          ${truncate(desc, 310)} 
          ${renderIf(providerDetails.info_url, (url) => `<a href="${url}">Read More</a>`)}
        </p>
      `
      )}
      
      <h3>Agency Details</h3>
      <p>
        ${renderIf(providerDetails.administrator, (admin) => `<strong>Administrator</strong> - ${admin}<br />`)}
        ${renderIf(providerDetails.type, (type) => `<strong>Type</strong> - ${type}<br />`)}
        ${renderIf(providerDetails.foundingYear, (year) => `<strong>Founding Year</strong> - ${year}<br />`)}
        ${renderIf(providerDetails.launchers, (launchers) => `<strong>Launchers</strong> - ${launchers}<br />`)}
        ${renderIf(providerDetails.spacecraft, (spacecraft) => `<strong>Spacecraft</strong> - ${spacecraft}`)}
      </p>
      
      <h3>${name} Launch Record</h3>
      <p>
        ${renderIf(providerDetails.launchSuccessCount, (count) => `<strong>Successful Launches</strong> - ${count}<br />`)}
        ${renderIf(providerDetails.launchFailedCount, (count) => `<strong>Failed Launches</strong> - ${count}<br />`)}
        ${renderIf(providerDetails.landingSuccessCount, (count) => `<strong>Successful Landings</strong> - ${count}<br />`)}
        ${renderIf(providerDetails.landingFailedCount, (count) => `<strong>Failed Landings</strong> - ${count}`)}
      </p>
    `
    )}
  `;
}
