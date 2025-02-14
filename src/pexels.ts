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
  apiKey?: string;
}

async function getPexelsMaterial({
  keyword,
  mediaType = 'photo',
  orientation,
  size,
  color,
  locale,
  page = 1,
  per_page = 20,
  apiKey = '',
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
    per_page,
  };

  try {
    const response = await axios.get(baseUrl, {
      params,
      headers: {
        Authorization: apiKey,
      },
    });

    const result = response.data;

    if (
      !result ||
      (mediaType === 'photo' && !result.photos) ||
      (mediaType === 'video' && !result.videos)
    ) {
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

    return media;
  } catch (error: any) {
    console.error('Error fetching media from Pexels:', error.message);
    return [];
  }
}

export { getPexelsMaterial, PexelsMaterialParams };
