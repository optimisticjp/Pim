import { satsangSeries, youtubeChannel, youtubeChannelId } from "@/lib/site-data";
import type { SatsangLiveStatus, SatsangSeries, SatsangVideo } from "@/lib/types";

export function getSatsangSeries(): SatsangSeries[] {
  return satsangSeries;
}

export function getCuratedSatsangVideos(): SatsangVideo[] {
  return [];
}

export function getOfficialUploadsPlaylistId(): string {
  return `UU${youtubeChannelId.slice(2)}`;
}

export function getOfficialYouTubeChannel(): string {
  return youtubeChannel;
}

// Leave undefined until a trusted API or committee workflow verifies a broadcast.
export function getSatsangLiveStatus(): SatsangLiveStatus | undefined {
  return undefined;
}
