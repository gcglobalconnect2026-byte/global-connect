"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { useTranslations } from "next-intl";

import { tv } from "@/lib/utils";
import { youtubeEmbedUrl } from "@/lib/youtube";

/**
 * Click-to-load YouTube player.
 *
 * The site sets no cookies and runs no consent banner, which is only a
 * defensible claim while nothing is fetched from a third party before the
 * visitor asks for it. Rendering an `<iframe>` in the server markup would
 * hand Google the visitor's IP, user agent and referrer on every page view
 * whether or not they wanted the video. So the pre-click state is our own
 * markup — no `i.ytimg.com` thumbnail either, for exactly the same reason —
 * and the iframe is injected by the click handler.
 */
const videoEmbed = tv({
  slots: {
    box: "relative aspect-video w-full overflow-hidden rounded-2xl bg-muted",
    placeholder:
      "absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 pb-10 text-center",
    playButton:
      "grid size-14 place-items-center rounded-full bg-foreground text-background transition-transform outline-none hover:scale-105 focus-visible:ring-3 focus-visible:ring-ring focus-visible:ring-offset-4 focus-visible:ring-offset-muted",
    playIcon: "size-6",
    title: "font-medium text-foreground",
    note: "absolute inset-x-4 bottom-3 text-center text-xs text-muted-foreground",
    iframe: "absolute inset-0 h-full w-full",
  },
});

export function YouTubeEmbed({
  videoId,
  title,
}: {
  videoId: string;
  title: string;
}) {
  const [playing, setPlaying] = useState(false);
  const t = useTranslations("Common");
  const slots = videoEmbed();

  if (playing) {
    return (
      <div className={slots.box()}>
        <iframe
          src={youtubeEmbedUrl(videoId, { autoplay: true })}
          title={title}
          // Media permissions only: accelerometer, gyroscope and clipboard
          // access are not needed to play a video, and asking for more is
          // asking for more consent than the visitor gave.
          allow="autoplay; encrypted-media; picture-in-picture; web-share"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          className={slots.iframe()}
        />
      </div>
    );
  }

  return (
    <div className={slots.box()}>
      <div className={slots.placeholder()}>
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={t("playVideo", { title })}
          className={slots.playButton()}
        >
          <Play className={slots.playIcon()} aria-hidden="true" fill="currentColor" />
        </button>
        <p className={slots.title()}>{title}</p>
        <p className={slots.note()}>{t("videoPrivacyNote")}</p>
      </div>
    </div>
  );
}
