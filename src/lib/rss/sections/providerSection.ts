import { getProviderDetails } from '@/lib/missionUtils';
import { renderIf, truncate } from '../utils/templateUtils';
import { Mission } from '@/types/missionProps';

export function buildProviderSection(mission: Mission, provider: ReturnType<typeof getProviderDetails>): string {
  const providerIntro = `
	<h2>Launch Provider ${provider.name ? `- ${provider.name}` : ''}</h2>
    
    ${renderIf(
      provider.desc,
      (desc) => `
      <p>${truncate(desc, 310)}</p>
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
	<h3>Agency Details</h3>
    <p>
      ${renderIf(provider.administrator, (admin) => `<strong>Administrator:</strong> ${admin}<br />`)}
      ${renderIf(provider.type, (type) => `<strong>Type:</strong> ${type}<br />`)}
      ${renderIf(provider.foundingYear, (year) => `<strong>Founding Year:</strong> ${year}<br />`)}
      ${renderIf(provider.launchers, (launchers) => `<strong>Launchers:</strong> ${launchers}<br />`)}
      ${renderIf(provider.spacecraft, (spacecraft) => `<strong>Spacecraft:</strong> ${spacecraft}`)}
    </p>
	`;

  const providerRecord = `
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
	`;

  return `
		${providerIntro}
		${providerDetails}
		${providerRecord}
  `;
}
