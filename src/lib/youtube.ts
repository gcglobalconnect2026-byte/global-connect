/**
 * YouTube URL helpers. Kept out of `richtext.tsx` so both the server-side
 * parser and the client-side facade share one definition of a video ID.
 */

/** Every URL shape an editor (or a pasted link) may produce. */
const YOUTUBE_RE =
  /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/;

export function youtubeVideoId(url: string): string | null {
  const match = url.match(YOUTUBE_RE);
  return match ? match[1] : null;
}

/**
 * `youtube-nocookie.com` rather than `youtube.com`: the embed is only ever
 * constructed after the visitor starts the video, so the first request to
 * Google already carries the stricter host.
 */
export function youtubeEmbedUrl(
  videoId: string,
  { autoplay = false }: { autoplay?: boolean } = {},
): string {
  const params = new URLSearchParams();
  if (autoplay) params.set("autoplay", "1");
  params.set("rel", "0");
  return `https://www.youtube-nocookie.com/embed/${videoId}?${params}`;
}
