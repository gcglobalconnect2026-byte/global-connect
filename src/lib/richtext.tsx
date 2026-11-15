import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import type { RenderNode } from "@contentful/rich-text-react-renderer";
import { BLOCKS, INLINES } from "@contentful/rich-text-types";
import type { Document as RichTextDocument } from "@contentful/rich-text-types";

import { tv } from "@/lib/utils";
import { CF_LOCALES } from "@/lib/contentful/locales";
import { youtubeVideoId } from "@/lib/youtube";
import { YouTubeEmbed } from "@/components/youtube-embed";

const richText = tv({
  slots: {
    root: "prose prose-neutral dark:prose-invert max-w-none prose-headings:tracking-tight prose-a:text-brand prose-img:rounded-2xl prose-img:my-8",
    image: "my-8 w-full rounded-2xl object-cover",
    figure: "my-8",
    caption: "mt-3 text-center text-sm text-muted-foreground",
  },
});

type AssetFile = {
  url?: string;
  details?: { image?: { width?: number; height?: number } };
  contentType?: string;
};

/**
 * Resolves a locale-aware value from either shape Contentful (or the bundled
 * seed) may return: unwrapped for a single-locale request, or keyed by locale
 * for `locale=*` / seed payloads. Picks the first shipped locale that is
 * present, which doubles as the default-locale fallback for entries that are
 * not translated yet.
 */
function localize<T>(value: unknown): T | undefined {
  if (value === undefined || value === null) return undefined;
  if (typeof value === "object" && !Array.isArray(value)) {
    const keyed = value as Record<string, T>;
    const hit = CF_LOCALES.find((code) => code in keyed);
    if (hit) return keyed[hit];
  }
  return value as T;
}

function assetUrl(
  target: unknown,
): { url: string; alt: string; width?: number; height?: number } | null {
  const asset = target as {
    fields?: {
      title?: string | Record<string, string>;
      description?: string | Record<string, string>;
      file?: AssetFile | Record<string, AssetFile>;
    };
  } | null;
  const file = localize<AssetFile>(asset?.fields?.file);
  if (!file?.url) return null;
  const url = file.url.startsWith("//") ? `https:${file.url}` : file.url;
  const alt =
    localize<string>(asset?.fields?.description) ??
    localize<string>(asset?.fields?.title) ??
    "";
  return {
    url,
    alt,
    width: file.details?.image?.width,
    height: file.details?.image?.height,
  };
}

const richTextSlots = richText();

// Module scope: the render callbacks keep a stable identity across renders.
const renderNode: RenderNode = {
  // The page already owns the <h1>, so a CMS heading-1 inside the body would
  // create a second h1 (this has already happened once). Demote it.
  [BLOCKS.HEADING_1]: (_node, children) => <h2>{children}</h2>,
  [BLOCKS.EMBEDDED_ASSET]: (node) => {
    const asset = assetUrl(node.data.target);
    if (!asset) return null;
    return (
      // eslint-disable-next-line @next/next/no-img-element -- CMS-rich-text images come from Contentful (images.ctfassets.net) and local fallback; next/image would need remotePatterns
      <img
        src={asset.url}
        alt={asset.alt}
        width={asset.width}
        height={asset.height}
        loading="lazy"
        className={richTextSlots.image()}
      />
    );
  },
  [INLINES.ASSET_HYPERLINK]: (node, children) => {
    const asset = assetUrl(node.data.target);
    if (!asset) return <>{children}</>;
    return (
      <a href={asset.url} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  },
  [BLOCKS.EMBEDDED_ENTRY]: (node, children) => {
    const entry = node.data.target as
      | {
          sys?: { contentType?: { sys?: { id?: string } } };
          fields?: Record<string, unknown>;
        }
      | undefined;
    const typeId = entry?.sys?.contentType?.sys?.id;
    if (typeId === "video" && entry?.fields) {
      const rawUrl = localize<string>(entry.fields.videoUrl) ?? "";
      const videoId = youtubeVideoId(rawUrl);
      if (!videoId) return null;
      const title = localize<string>(entry.fields.title) ?? "Video";
      const caption = localize<string>(entry.fields.caption);
      return (
        <figure className={richTextSlots.figure()}>
          <YouTubeEmbed videoId={videoId} title={title} />
          {caption && (
            <figcaption className={richTextSlots.caption()}>
              {caption}
            </figcaption>
          )}
        </figure>
      );
    }
    return <>{children}</>;
  },
};

export function RichText({ document }: { document: RichTextDocument }) {
  return (
    <div className={richTextSlots.root()}>
      {documentToReactComponents(document, { renderNode })}
    </div>
  );
}
