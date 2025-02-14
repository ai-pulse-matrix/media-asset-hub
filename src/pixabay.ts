import axios from 'axios';
import { MediaData } from './data';

const PIXABAY_API_URL: string = 'https://pixabay.com/api/videos/';

interface PixabayMaterialParams {
  keyword: string;
  mediaType?: 'photo' | 'video';
  lang?: string;
  minWidth?: number;
  minHeight?: number;
  editorsChoice?: boolean;
  safeSearch?: boolean;
  order?: string;
  page?: number;
  perPage?: number;
  apiKey?: string;
}

async function getPixabayMaterial({
  keyword,
  mediaType = 'photo',
  lang = 'en',
  minWidth = 300,
  minHeight = 500,
  editorsChoice = false,
  safeSearch = false,
  order = 'popular',
  page = 1,
  perPage = 20,
  apiKey = '',
}: PixabayMaterialParams): Promise<MediaData[] | null> {
  const params: Record<string, any> = {
    key: apiKey,
    q: keyword,
    lang,
    min_width: minWidth,
    min_height: minHeight,
    editors_choice: editorsChoice,
    safesearch: safeSearch,
    order,
    page,
    per_page: perPage,
  };

  if (mediaType === 'video') {
    params.video_type = 'all';
  } else if (mediaType === 'photo') {
    params.image_type = 'all';
  }

  try {
    const response = await axios.get(PIXABAY_API_URL, { params });
    const result = response.data;

    if (!result || !result.hits || !result.hits.length) return null;

    const media: MediaData[] = result.hits.map((item: any) => ({
      provider: 'pixabay',
      keyword,
      url: mediaType === 'video' ? item.videos.large.url : item.largeImageURL,
      duration: mediaType === 'video' ? item.duration : null,
      mediaType: mediaType === 'video' ? 'video' : 'photo',
    }));

    return media;
  } catch (error) {
    console.error(
      'Error fetching media from Pixabay:',
      (error as Error).message,
    );
    return null;
  }
}

export { getPixabayMaterial, PixabayMaterialParams };
