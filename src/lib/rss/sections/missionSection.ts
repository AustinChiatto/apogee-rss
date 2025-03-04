import { Mission } from '@/types/missionProps';
import { renderIf, truncate } from '../utils/templateUtils';
import { getMissionDetails } from '@/lib/missionUtils';

export function buildMissionSection(mission: Mission, missionDetails: ReturnType<typeof getMissionDetails>): string {
  // get the header section with mission image and basic info
  const headerSection = `
    ${renderIf(
      mission.image,
      (img) =>
        `<img src="${img}" alt="Launch image" style="max-width:100%; height:auto;" />
       <br />`
    )}
    
    ${renderIf(missionDetails.statusName, (status) => `<p><strong>Launch Status:</strong> ${status}</p>`)}
    
    ${renderIf(
      missionDetails.net,
      (time) =>
        `<p><strong>Launch Time:</strong> ${time}</p>
       <br />`
    )}
  `;

  // mission details content
  const detailsSection = `
    <h2>Mission Details</h2>
    <p>
      ${renderIf(missionDetails.type, (type) => `<strong>Mission Type:</strong> ${type}<br />`)}
      
      ${renderIf(
        missionDetails.orbitName,
        (orbit) => `
        <strong>Mission Destination:</strong> ${orbit}
        ${renderIf(missionDetails.orbitDesc, (desc) => ` - ${desc}`)}
        <br />
      `
      )}
      
      ${renderIf(missionDetails.padName, (pad) =>
        renderIf(
          missionDetails.mapUrl,
          (url) => `<strong>Launch site:</strong> <a href="${url}">${pad}</a>`,
          () => `<strong>Launch site:</strong> ${pad}`
        )
      )}
      
      ${renderIf(
        mission.rocket?.launcher_stage?.[0]?.landing,
        (landing) => `
        <br /><strong>Landing:</strong> ${
          landing.attempt ? (landing.success !== null ? (landing.success ? 'Successful' : 'Failed') : 'Attempted') : 'No attempt'
        }
        ${renderIf(
          landing.location?.name,
          (name) => `
          on <span title="${landing.location.description || ''}">${name}</span>
        `
        )}
      `
      )}
    </p>
    
    ${renderIf(missionDetails.desc, (desc) => `<p>${truncate(desc, 310)}</p>`)}
    
    ${renderIf(mission.rocket?.launcher_stage?.[0]?.landing?.description, (desc) => `<p><em>Landing note: ${truncate(desc, 200)}</em></p>`)}
  `;

  // mission video section (if available)
  const videoSection = renderIf(
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
  );

  return `
    ${headerSection}
    ${detailsSection}
    ${videoSection}
  `;
}
