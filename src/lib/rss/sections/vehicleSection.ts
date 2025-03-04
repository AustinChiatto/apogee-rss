import { Mission } from '@/types/missionProps';
import { renderIf, truncate } from '../utils/templateUtils';
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
	`;

  const vehicleStats = `
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
	`;

  const vehicleRecord = `
		<h3>Launch Record</h3>
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
		${vehicleRecord}
  `;
}
