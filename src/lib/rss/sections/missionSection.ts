import { Mission } from '@/types/missionProps';
import { renderIf } from '../utils/templateUtils';
import { getMissionDetails } from '@/lib/missionUtils';

export function buildMissionSection(mission: Mission, missionDetails: ReturnType<typeof getMissionDetails>): string {
  // mission image and basic info
  const headerSection = `
    ${renderIf(
      mission.image,
      (img) =>
        `<img src="${img}" alt="Launch image" style="max-width:100%; height:auto;" />
       <p></p>`
    )}
    
    ${renderIf(missionDetails.statusName, (status) => `<p><strong>Launch Status:</strong> ${status}</p>`)}
    
    ${renderIf(missionDetails.net, (time) => `<p><strong>Launch Time:</strong> ${time}</p>`)}

		${renderIf(missionDetails.desc, (desc) => `<p>${desc}</p><br />`)}
  `;

  // mission details content
  const detailsSection = `
    <h2>Mission Details</h2>
    <p>
      ${renderIf(missionDetails.type, (type) => `<strong>Type:</strong> ${type}<br />`)}
      
      ${renderIf(
        missionDetails.orbitName,
        (orbit) => `
        <strong>Destination:</strong> ${missionDetails.orbitAbbrev} - ${orbit}<br />
        ${renderIf(missionDetails.orbitDesc, (desc) => `${desc}`)}
        <br />
      `
      )}
		</p>
		<p>
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
				<strong>Landing:</strong> ${landing.attempt ? (landing.success !== null ? (landing.success ? 'Successful' : 'Failed') : 'Attempted') : 'No attempt'}
			`
      )}
		</p>
		${renderIf(mission.rocket?.launcher_stage?.[0]?.landing?.description, (desc) => `<p><em>${desc}</em></p>`)}
		${renderIf(
      mission.program && mission.program.length > 0,
      () =>
        `<p><strong>Program:</strong> ${mission.program[0].name} - ${mission.program[0].type.name}<br />
			${renderIf(mission.program[0].description, (desc) => `<p>${desc}</p>`)}</p>`
    )}
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
  `
  );

  return `
    ${headerSection}
    ${detailsSection}
    ${videoSection}
  `;
}
