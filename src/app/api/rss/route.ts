import RSS from 'rss';
import { Mission } from '@/types/missionProps';
import { getMissionDetails, getProviderDetails, getVehicleDetails } from '@/lib/missionUtils';

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
			<h2>H2</h2>
			<h3>H3</h3>
			<h4>H4</h4>
			<h5>H5</h5>
			<p>Launch Status: ${missionDetails.statusName}</p>
			<p>Launch Time: ${missionDetails.net}</p>
			</br>
			<h2>Mission Details</h2>
			<p>Mission Type - ${missionDetails.type}</p>
			<p>Mission Destination - ${missionDetails.orbitName}</p>
			<p>Program - (Add program info if needed)</p>
			<p>Launch site - ${missionDetails.padName}</p>
			<p>${missionDetails.desc}</p>
			</br>
			<h2>${rocketDetails.fullName}</h2>
			<p>${rocketDetails.desc}</p>

			<p><strong>Vehicle Stats</strong></p>
			<ul>
				<li>Length - ${rocketDetails.length ?? 'N/A'} m</li>
				<li>Diameter - ${rocketDetails.diameter ?? 'N/A'} m</li>
				<li>Launch Mass - ${rocketDetails.launchCost ?? 'N/A'}</li>
				<li>LEO Capacity - ${rocketDetails.capacityLeo ?? 'N/A'}</li>
				<li>GTO Capacity - ${rocketDetails.capacityGto ?? 'N/A'}</li>
				<li>Thrust - ${rocketDetails.thrustTo ?? 'N/A'} kN</li>
			</ul>

			<p><strong>Launch & Landing Record</strong></p>
			<ul>
				<li>Successful Launches - ${rocketDetails.launchSuccessCount ?? 'N/A'}</li>
				<li>Failed Launches - ${rocketDetails.launchFailedCount ?? 'N/A'}</li>
				<li>Successful Landings - ${rocketDetails.landingSuccessCount ?? 'N/A'}</li>
				<li>Failed Landings - ${rocketDetails.landingFailedCount ?? 'N/A'}</li>
			</ul>

			</br>
			<h2>${providerDetails.name}</h2>
			<p>Administrator - ${providerDetails.administrator}</p>
			<p>Type - ${providerDetails.type}</p>
			<p>Founding Year - ${providerDetails.foundingYear}</p>
			<p>${providerDetails.desc}</p>

			<p><strong>Launch & Landing Record</strong></p>
			<ul>
				<li>Successful Launches - ${providerDetails.launchSuccessCount ?? 'N/A'}</li>
				<li>Failed Launches - ${providerDetails.launchFailedCount ?? 'N/A'}</li>
				<li>Successful Landings - ${providerDetails.landingSuccessCount ?? 'N/A'}</li>
				<li>Failed Landings - ${providerDetails.landingFailedCount ?? 'N/A'}</li>
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
