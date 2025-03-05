import { Mission } from '@/types/missionProps';
import { renderIf, formatNumber } from '../utils/templateUtils';
import { getVehicleDetails } from '@/lib/missionUtils';

export function buildVehicleSection(mission: Mission, rocket: ReturnType<typeof getVehicleDetails>): string {
  const booster = mission.rocket?.launcher_stage?.[0];

  // check if there are any launch or landing attempts
  const hasLaunchAttempts = (rocket.launchSuccessCount || 0) + (rocket.launchFailedCount || 0) > 0;
  const hasLandingAttempts = (rocket.landingSuccessCount || 0) + (rocket.landingFailedCount || 0) > 0;

  const vehicleIntro = `
		<br />
		<h2>Launch Vehicle - ${rocket.fullName || 'Unknown'}</h2>
    ${renderIf(rocket.image_url, (img) => `<img src="${img}" alt="Rocket image" style="max-width:100%; height:auto;" />`)}
    ${renderIf(rocket.desc, (desc) => `<p>${desc}</p>`)}
		${renderIf(
      rocket.info_url,
      (url) => `
      <p><a href="${url}">Explore ${rocket.fullName || 'launch vehicle'}</a></p>
    `
    )}
	`;

  const boosterDetails = `
	${renderIf(
    booster,
    (stage) => `
		<h3>Booster</h3>
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
	`;

  const spacecraftDetails = `
	${renderIf(
    mission.rocket?.spacecraft_stage,
    (spacecraft) => `
			<h3>Spacecraft</h3>
			<p>
				${renderIf(spacecraft.spacecraft?.name, (name) => `<strong>Name:</strong> ${name}<br />`)}
				${renderIf(spacecraft.destination, (dest) => `<strong>Destination:</strong> ${dest}<br />`)}
				${renderIf(
          spacecraft.landing,
          (landing) => `
				<strong>Landing:</strong> 
					${landing.attempt ? (landing.success !== null ? (landing.success ? 'Successful' : 'Failed') : 'Planned') : 'No attempt'}
					${renderIf(landing.location?.name, (name) => ` in ${name}`)}
					${renderIf(landing.description, (desc) => `<br /><em>${desc}</em>`)}
			`
        )}
				${renderIf(spacecraft.spacecraft?.spacecraft_config?.capability, (capability) => `<br /><strong>Capability:</strong> ${capability}<br />`)}
			</p>
			
			${renderIf(spacecraft.spacecraft?.description, (desc) => `<p>${desc}</p>`)}
		`
  )}
	`;

  const vehicleStats = `
		<h3>Specifications</h3>
    <p>
      ${renderIf(rocket.length, (len) => `<strong>Length:</strong> ${formatNumber(len)} m<br />`)}
      ${renderIf(rocket.diameter, (dia) => `<strong>Diameter:</strong> ${formatNumber(dia)} m<br />`)}
      ${renderIf(rocket.launchMass, (mass) => `<strong>Launch Mass:</strong> ${formatNumber(mass)} tons<br />`)}
      ${renderIf(rocket.launchCost, (cost) => `<strong>Launch Cost:</strong> $${parseInt(formatNumber(cost)).toLocaleString()}<br />`)}
      ${renderIf(rocket.capacityLeo, (leo) => `<strong>LEO Capacity:</strong> ${formatNumber(leo)} kg<br />`)}
      ${renderIf(rocket.capacityGto, (gto) => `<strong>GTO Capacity:</strong> ${formatNumber(gto)} kg<br />`)}
      ${renderIf(rocket.thrustTo, (thrust) => `<strong>Thrust:</strong> ${formatNumber(thrust)} kN`)}
    </p>
	`;

  const vehicleRecord = `
		<h3>${rocket.name} Launch Record</h3>
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

  return `
		${vehicleIntro}
		${vehicleStats}
		${boosterDetails}
		${spacecraftDetails}
		${vehicleRecord}
  `;
}
