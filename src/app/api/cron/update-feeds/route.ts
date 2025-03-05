import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getUpcomingMissions } from '@/lib/launchData';

export async function GET() {
  try {
    // force refresh the data
    const missions = await getUpcomingMissions(true);
    console.log(`Refreshed data with ${missions.length} upcoming launches`);

    // revalidate all feed paths
    revalidatePath('/api/rss');
    revalidatePath('/api/rss-no-starlink');
    revalidatePath('/api/rss-starship');

    // return success response
    return NextResponse.json({
      success: true,
      message: 'Launch data refreshed and feeds revalidated',
      timestamp: new Date().toISOString(),
      launchesCount: missions.length
    });
  } catch (error) {
    console.error('Feed update failed:', error);
    return NextResponse.json(
      {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
