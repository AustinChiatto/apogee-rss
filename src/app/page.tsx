'use client';
import Image from 'next/image';
import { toast } from 'sonner';

interface FeedLink {
  name: string;
  path: string;
}

export default function Home() {
  const baseUrl = 'https://apogee-rss.vercel.app/api';

  const feeds: FeedLink[] = [
    { name: 'Upcoming Launches', path: '/rss' },
    { name: 'Exclude Starlink', path: '/rss-no-starlink' },
    { name: 'Starship Launches', path: '/rss-starship' },
    { name: 'Crewed Launches', path: '/rss-crewed' }
  ];

  const copyFeed = (feed: FeedLink) => {
    const feedUrl = `${baseUrl}${feed.path}`;

    navigator.clipboard
      .writeText(feedUrl)
      .then(() => {
        toast(`Copied 🎉`, {
          description: 'The feed URL has been copied to your clipboard'
        });
      })
      .catch(() => {
        toast('Uh oh!', {
          description: 'Something went wrong, please try again later.'
        });
      });
  };

  return (
    <main className="p-6">
      <div className="flex gap-4 items-center">
        <Image
          src="/apogee-logo.png"
          alt="Apogee Logo"
          width={32}
          height={32}
        />
        <h1 className="text-lg font-bold">Apogee RSS - Track Upcoming Launches</h1>
      </div>
      <div className="py-6">
        <h2 className="font-semibold">Available Feeds</h2>
        <ul className="pt-2 px-4 list-disc">
          {feeds.map((feed) => (
            <li
              key={feed.path}
              className="cursor-pointer flex items-center gap-2 hover:text-blue-500"
              onClick={() => copyFeed(feed)}
            >
              <span>{feed.name}</span>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
