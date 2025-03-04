import { getProviderDetails } from '@/lib/missionUtils';
import { renderIf } from '../utils/templateUtils';
import { Mission } from '@/types/missionProps';

export function buildProviderSection(mission: Mission, provider: ReturnType<typeof getProviderDetails>): string {
  // check if there are any launch or landing attempts
  const hasLaunchAttempts = (provider.launchSuccessCount || 0) + (provider.launchFailedCount || 0) > 0;
  const hasLandingAttempts = (provider.landingSuccessCount || 0) + (provider.landingFailedCount || 0) > 0;

  const providerIntro = `
		<h2>Launch Provider ${provider.name ? `- ${provider.name}` : ''}</h2>
		${renderIf(provider.image, (img) => `<img src="${img}" alt="Provider image" style="max-width:100%; height:auto;" />`)}
		${renderIf(
      provider.desc,
      (desc) => `
			<p>${desc}</p>
		`
    )}

		${renderIf(
      provider.info_url,
      (url) => `
			<p><a href="${url}">Discover more of ${provider.name || 'this provider'}</a></p>
		`
    )}		
	`;

  const providerDetails = `
		<h3>Organization Details</h3>
		<p>
		${renderIf(provider.administrator, (admin) => `<strong>Administrator:</strong> ${admin}<br />`)}
		${renderIf(provider.type, (type) => `<strong>Type:</strong> ${type}<br />`)}
		${renderIf(provider.foundingYear, (year) => `<strong>Founding Year:</strong> ${year}<br />`)}
		</p>
		<p>
		${renderIf(provider.launchers, (launchers) => `<strong>Launchers:</strong> ${launchers}<br />`)}
		${renderIf(provider.spacecraft, (spacecraft) => `<strong>Spacecraft:</strong> ${spacecraft}`)}
		</p>
	`;

  const providerRecord = `
		<h3>${provider.name} Launch Record</h3>
		<p>
      ${
        !hasLaunchAttempts
          ? `<strong>Launch Attempts:</strong> ${provider.launchSuccessCount}<br />`
          : `${renderIf(provider.launchSuccessCount, (count) => `<strong>Successful Launches:</strong> ${count}<br />`)}
         ${renderIf(provider.launchFailedCount, (count) => `<strong>Failed Launches:</strong> ${count}<br />`)}`
      }
      
      ${
        !hasLandingAttempts
          ? `<strong>Landing Attempts:</strong> ${provider.landingSuccessCount}`
          : `${renderIf(provider.landingSuccessCount, (count) => `<strong>Successful Landings:</strong> ${count}<br />`)}
         ${renderIf(provider.landingFailedCount, (count) => `<strong>Failed Landings:</strong> ${count}`)}`
      }
    </p>
	`;

  return `
		${providerIntro}
		${providerDetails}
		${providerRecord}
  `;
}
