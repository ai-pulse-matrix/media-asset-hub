import axios from 'axios';
import { MediaData } from './data';

const PIXABAY_API_URL: string = 'https://pixabay.com/api/';

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
  per_page?: number;
  apiKey?: string;
  verbose?: boolean;
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
  per_page,
  perPage = 20,
  apiKey = '',
  verbose = false,
}: PixabayMaterialParams): Promise<MediaData[] | null> {
  const params: Record<string, any> = {
    key: apiKey,
    q: encodeURIComponent(keyword),
    lang,
    min_width: minWidth,
    min_height: minHeight,
    editors_choice: editorsChoice,
    safesearch: safeSearch,
    order,
    page,
    per_page: per_page || perPage,
  };

  let url = PIXABAY_API_URL;
  if (mediaType === 'video') {
    url += 'videos/';
  }

  if (verbose) {
    console.log('Sending request to Pixabay API with params:', params);
  }

  try {
    const response = await axios.get(url, { params });
    const result = response.data;

    if (verbose) {
      console.log('Received response from Pixabay API:', result);
    }

    if (!result || !result.hits || !result.hits.length) return null;

    const media: MediaData[] = result.hits.map((item: any) => ({
      provider: 'pixabay',
      keyword,
      url: mediaType === 'video' ? item.videos.large.url : item.largeImageURL,
      duration: mediaType === 'video' ? item.duration : null,
      mediaType: mediaType === 'video' ? 'video' : 'photo',
      width: mediaType === 'video' ? item.videos.large.width : item.imageWidth,
      height:
        mediaType === 'video' ? item.videos.large.height : item.imageHeight,
      thumbnailUrl:
        mediaType === 'video' ? item.videos.large.thumbnail : item.previewURL,
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
