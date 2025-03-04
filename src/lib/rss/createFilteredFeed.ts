import RSS from 'rss';
import { Mission } from '@/types/missionProps';
import { getMissionDetails } from '@/lib/missionUtils';
import { buildRssItemDescription } from './rssBuilder';
import { getUpcomingMissions } from '../launchData';

export async function createFilteredFeed(filter: (missions: Mission[]) => Mission[], feedTitle: string, feedDescription: string, feedPath: string) {
  try {
    const allMissions = await getUpcomingMissions();
    const filteredMissions = filter(allMissions);

    // create a new feed
    const feed = new RSS({
      title: feedTitle,
      description: feedDescription,
      site_url: 'https://apogee-rss.vercel.app',
      feed_url: `https://apogee-rss.vercel.app/api/${feedPath}`,
      image_url: 'https://apogee-rss.vercel.app/apogee-logo.png',
      language: 'en',
      pubDate: new Date(),
      ttl: 60
    });

    // convert missions to rss items
    filteredMissions.forEach((mission) => {
      const missionDetails = getMissionDetails(mission);

      feed.item({
        title: mission.name,
        description: buildRssItemDescription(mission),
        url: 'https://apogee-rss.vercel.app/missions/' + mission.id,
        guid: mission.id,
        date: missionDetails.net ? new Date(missionDetails.net) : new Date(),
        enclosure: {
          url: mission.image || 'https://apogee-rss.vercel.app/image-placeholder.jpg',
          type: mission.image?.endsWith('.png') ? 'image/png' : 'image/jpeg'
        }
      });
    });

    const xml = feed.xml({ indent: true });

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
