import RSS from 'rss';
import { Mission } from '@/types/missionProps';
import { getMissionDetails } from '@/lib/missionUtils';
import { buildRssItemDescription } from '@/lib/rssBuilder';

/**
 * fetches upcoming space launches with 1-hour cache
 */
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

/**
 * feed route handler
 */
export async function GET() {
  try {
    // fetch upcoming missions
    const upcomingMissions = await getUpcomingMissions();

    // create a new RSS feed
    const feed = new RSS({
      title: 'Launch Tracker - Upcoming',
      description: 'Stay up to date with the latest rocket launches',
      site_url: 'https://apogee-rss.vercel.app',
      feed_url: 'https://apogee-rss.vercel.app/api/rss',
      image_url: 'https://apogee-rss.vercel.app/apogee-logo.png',
      language: 'en',
      pubDate: new Date(),
      ttl: 60
    });

    // convert missions to rss items
    upcomingMissions.forEach((mission) => {
      const missionDetails = getMissionDetails(mission);

      // handle potential missing image
      const imageUrl = mission.image || 'https://apogee-rss.vercel.app/image-placeholder.jpg';
      const imageType = imageUrl.endsWith('.png') ? 'image/png' : 'image/jpeg';

      feed.item({
        title: mission.name || 'Unknown or Classified',
        description: buildRssItemDescription(mission),
        url: 'https://apogee-rss.vercel.app/missions/' + mission.id,
        date: missionDetails.net ? new Date(missionDetails.net) : new Date(),
        enclosure: {
          url: imageUrl,
          type: imageType
        },
        guid: mission.id
      });
    });

    // generate xml
    const xml = feed.xml({ indent: true });

    // return response with the rss xml
    return new Response(xml, {
      status: 200,
      headers: {
        'Content-Type': 'application/rss+xml',
        'Cache-Control': 'public, max-age=3600'
      }
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
}
