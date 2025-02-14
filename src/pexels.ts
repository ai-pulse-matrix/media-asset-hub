import axios from 'axios';
import { MediaData } from './data';

interface PexelsMaterialParams {
  keyword: string;
  mediaType?: 'photo' | 'video';
  orientation?: string;
  size?: string;
  color?: string;
  locale?: string;
  page?: number;
  per_page?: number;
  perPage?: number;
  apiKey?: string;
  verbose?: boolean;
}

async function getPexelsMaterial({
  keyword,
  mediaType = 'photo',
  orientation,
  size,
  color,
  locale,
  page = 1,
  per_page,
  perPage = 20,
  apiKey = '',
  verbose = false,
}: PexelsMaterialParams): Promise<MediaData[]> {
  const baseUrl =
    mediaType === 'video'
      ? 'https://api.pexels.com/videos/search'
      : 'https://api.pexels.com/v1/search';

  const params = {
    query: keyword,
    orientation,
    size,
    color,
    locale,
    page,
    per_page: per_page || perPage,
  };

  if (verbose) {
    console.log(`Sending request to Pexels API for ${mediaType}s:`, {
      url: baseUrl,
      params,
    });
  }

  try {
    const response = await axios.get(baseUrl, {
      params,
      headers: {
        Authorization: apiKey,
      },
    });

    const result = response.data;

    if (verbose) {
      console.log('Received response from Pexels API:', result);
    }

    if (
      !result ||
      (mediaType === 'photo' && !result.photos) ||
      (mediaType === 'video' && !result.videos)
    ) {
      if (verbose) {
        console.log('No media found in the Pexels API response');
      }
      return [];
    }

    const media: MediaData[] = (
      mediaType === 'photo' ? result.photos : result.videos
    ).map((item: any) => ({
      provider: 'pexels',
      keyword,
      url: mediaType === 'video' ? item.video_files[0].link : item.src.original,
      duration: mediaType === 'video' ? item.duration : null,
      mediaType: mediaType,
      width: item.width,
      height: item.height,
    }));

    if (verbose) {
      console.log(`Processed ${media.length} ${mediaType}s from Pexels API`);
    }

    return media;
  } catch (error: any) {
    console.error('Error fetching media from Pexels:', error.message);
    if (verbose) {
      console.error('Detailed error:', error);
    }
    return [];
  }
}

export { getPexelsMaterial, PexelsMaterialParams };
