import { MediaData } from './data';
import { getPexelsMaterial, PexelsMaterialParams } from './pexels';
import { getPixabayMaterial, PixabayMaterialParams } from './pixabay';
import { batchDownloadFiles } from './download';

interface SearchAndDownloadParams {
  keyword: string;
  mediaType: 'photo' | 'video';
  outputDir: string;
  site: string;
  apiKey: string;
  params?: Partial<PexelsMaterialParams | PixabayMaterialParams>;
  useUUID?: boolean; // 新增参数
}

async function searchAndDownloadMedia({
  keyword,
  mediaType,
  outputDir,
  site,
  apiKey,
  params = {},
  useUUID = false, 
}: SearchAndDownloadParams): Promise<string[]> {
  let media: MediaData[] = [];

  if (site === 'pexels') {
    media = await getPexelsMaterial({
      keyword,
      mediaType,
      apiKey,
      ...(params as Partial<PexelsMaterialParams>),
    });
  } else if (site === 'pixabay') {
    const pixabayMedia = await getPixabayMaterial({
      keyword,
      mediaType,
      apiKey,
      ...(params as Partial<PixabayMaterialParams>),
    });
    media = pixabayMedia || [];
  } else {
    throw new Error('Invalid site specified. Use "pexels" or "pixabay".');
  }

  // Download all media
  if (media.length > 0) {
    const downloadedFiles = await batchDownloadFiles(media, outputDir, useUUID); // 传入 useUUID 参数
    return downloadedFiles;
  } else {
    console.log(`No media found on ${site} for the given keyword and type.`);
    return [];
  }
}

export { searchAndDownloadMedia };
