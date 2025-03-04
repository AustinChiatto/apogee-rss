import { Mission } from '@/types/missionProps';
import { renderIf, formatDate } from '../utils/templateUtils';
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
    ${renderIf(missionDetails.net, (time) => `<p><strong>Launch Time:</strong> ${formatDate(time)}</p>`)}
		${renderIf(missionDetails.desc, (desc) => `<p>${desc}</p>`)}
		${renderIf(
      missionDetails.vidUrl,
      (url) => `
			<p><a href="${url}">Watch launch</a></p>
			`
    )}
  `;

  // mission details content
  const detailsSection = `
		<br />
    <h2>Mission</h2>
    <p>
      ${renderIf(missionDetails.type, (type) => `<strong>Payload Type:</strong> ${type}<br />`)}
      ${renderIf(
        missionDetails.orbitName,
        (orbit) => `
        <strong>Destination:</strong> ${orbit} (${missionDetails.orbitAbbrev})
        ${renderIf(missionDetails.orbitDesc, (desc) => ` - ${desc}`)}
        <br />
      `
      )}
			${renderIf(missionDetails.padName, (pad) =>
        renderIf(
          missionDetails.mapUrl,
          (url) => `<strong>Launch site:</strong> <a href="${url}">${pad}</a><br />`,
          () => `<strong>Launch site:</strong> ${pad}`
        )
      )}
			${renderIf(
        mission.rocket?.launcher_stage?.[0]?.landing,
        (landing) => `
				<strong>Landing:</strong> ${
          landing.attempt ? (landing.success !== null ? (landing.success ? 'Successful' : 'Failed') : 'Will Attempt') : 'No attempt'
        }
			`
      )}
			</p>
			${renderIf(mission.rocket?.launcher_stage?.[0]?.landing?.description, (desc) => `<p><em>${desc}</em></p>`)}
			`;

  const programSection = `
			${renderIf(
        mission.program && mission.program.length > 0,
        () => `
				<br />
				<h2>Program</h2>
				<p><strong>${mission.program[0].name}</strong> - ${mission.program[0].type.name}</p>
				<p>${mission.program[0].description}</p>
			`
      )}
			`;

  return `
    ${headerSection}
    ${detailsSection}
    ${programSection}
  `;
}
