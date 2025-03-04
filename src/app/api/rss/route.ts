import RSS from 'rss';
import { Mission } from '@/types/missionProps';
import { getMissionDetails, getProviderDetails, getVehicleDetails } from '@/lib/missionUtils';

function truncate(text: string, maxCharacters: number): string {
  if (text.length <= maxCharacters) {
    return text;
  }
  return text.slice(0, maxCharacters) + '...';
}

// fetch upcoming missions
async function getUpcomingMissions(): Promise<Mission[]> {
  const res = await fetch('https://ll.thespacedevs.com/2.2.0/launch/upcoming/?mode=detailed', {
    next: { revalidate: 3600 }
  });

  if (!res.ok) {
    throw new Error('Failed to fetch upcoming missions');
  }

  const data = await res.json();
  return data.results ?? [];
}

export async function GET() {
  try {
    // 1. fetch upcoming missions
    const upcomingMissions = await getUpcomingMissions();

    // 2. create a new RSS feed
    const feed = new RSS({
      title: 'Upcoming Space Launches',
      description: 'Stay up to date with the latest rocket launches',
      site_url: 'https://apogee-rss.vercel.app',
      feed_url: 'https://apogee-rss.vercel.app/api/rss',
      image_url: '',
      language: 'en'
    });

    // 3. convert missions to rss items
    upcomingMissions.forEach((mission) => {
      const missionDetails = getMissionDetails(mission);
      const rocketDetails = getVehicleDetails(mission.rocket);
      const providerDetails = getProviderDetails(mission.launch_service_provider);

      const customDescription = `
			<img src="${mission.image}" alt="Launch image" style="max-width:100%; height:auto;" />
			<a href="${mission.url}">Watch Now</a>
			<h1>${mission.name}</h1>
			</br>
			<p><strong>Launch Status</strong>: ${missionDetails.statusName}</p>
			<p><strong>Launch Time</strong>: ${missionDetails.net}</p>
			<h2>Mission Details</h2>
			<p>${truncate(missionDetails.desc, 310)}</p>
				<p><strong>Mission Type</strong> - ${missionDetails.type}
				</br><strong>Mission Destination</strong> - ${missionDetails.orbitName}
				</br><strong>Program</strong> - (Add program info if needed)
				</br><strong>Launch site</strong> - ${missionDetails.padName}</p>
			</br>
			<h2>${rocketDetails.fullName}</h2>
			<p>${truncate(rocketDetails.desc, 310)}</p>
			<a href="${rocketDetails.info_url}">Read More</a>
			<h5>Vehicle Stats</h5>
			<ul>
				<li><strong>Length</strong> - ${rocketDetails.length ?? 'N/A'} m</li>
				<li><strong>Diameter</strong> - ${rocketDetails.diameter ?? 'N/A'} m</li>
				<li><strong>Launch Mass</strong> - ${rocketDetails.launchCost ?? 'N/A'}</li>
				<li><strong>LEO Capacity</strong> - ${rocketDetails.capacityLeo ?? 'N/A'}</li>
				<li><strong>GTO Capacity</strong> - ${rocketDetails.capacityGto ?? 'N/A'}</li>
				<li><strong>Thrust</strong> - ${rocketDetails.thrustTo ?? 'N/A'} kN</li>
			</ul>
			<h5>Launch & Landing Record</h5>
			<ul>
				<li><strong>Successful Launches</strong> - ${rocketDetails.launchSuccessCount ?? 'N/A'}</li>
				<li><strong>Failed Launches</strong> - ${rocketDetails.launchFailedCount ?? 'N/A'}</li>
				<li><strong>Successful Landings</strong> - ${rocketDetails.landingSuccessCount ?? 'N/A'}</li>
				<li><strong>Failed Landings</strong> - ${rocketDetails.landingFailedCount ?? 'N/A'}</li>
			</ul>
			</br>
			<h2>${providerDetails.name}</h2>
			<p><strong>Administrator</strong> - ${providerDetails.administrator}</p>
			<p><strong>Type</strong> - ${providerDetails.type}</p>
			<p><strong>Founding Year</strong> - ${providerDetails.foundingYear}</p>
			<p>${truncate(providerDetails.desc, 310)}</p>
			<a href="${providerDetails.info_url}">Read More</a>
			<h5>Launch & Landing Record</h5>
			<ul>
				<li><strong>Successful Launches</strong> - ${providerDetails.launchSuccessCount ?? 'N/A'}</li>
				<li><strong>Failed Launches</strong> - ${providerDetails.launchFailedCount ?? 'N/A'}</li>
				<li><strong>Successful Landings</strong> - ${providerDetails.landingSuccessCount ?? 'N/A'}</li>
				<li><strong>Failed Landings</strong> - ${providerDetails.landingFailedCount ?? 'N/A'}</li>
			</ul>
  `;

      feed.item({
        title: mission.name,
        description: customDescription || 'No mission description provided',
        url: 'https://apogee-rss.vercel.app/missions/' + mission.id,
        date: mission.net,
        enclosure: {
          url: mission.image,
          type: mission.image.endsWith('.png') ? 'image/png' : 'image/jpeg'
        }
      });
    });

    // 4. generate xml
    const xml = feed.xml({ indent: true });

    // 5. return response with the rss xml
    return new Response(xml, {
      status: 200,
      headers: { 'Content-Type': 'application/rss+xml' }
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
}
