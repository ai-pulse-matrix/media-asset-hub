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
  useUUID?: boolean;
  verbose?: boolean; // 新增参数
}

async function searchAndDownloadMedia({
  keyword,
  mediaType,
  outputDir,
  site,
  apiKey,
  params = {},
  useUUID = false,
  verbose = false, 
}: SearchAndDownloadParams): Promise<string[]> {
  let media: MediaData[] = [];

  if (verbose) {
    console.log(`Searching for ${mediaType}s on ${site} with keyword: ${keyword}`);
  }

  if (site === 'pexels') {
    media = await getPexelsMaterial({
      keyword,
      mediaType,
      apiKey,
      ...(params as Partial<PexelsMaterialParams>),
      verbose, 
    });
  } else if (site === 'pixabay') {
    const pixabayMedia = await getPixabayMaterial({
      keyword,
      mediaType,
      apiKey,
      ...(params as Partial<PixabayMaterialParams>),
      verbose, 
    });
    media = pixabayMedia || [];
  } else {
    throw new Error('Invalid site specified. Use "pexels" or "pixabay".');
  }

  if (verbose) {
    console.log(`Found ${media.length} ${mediaType}s on ${site}`);
  }

  // Download all media
  if (media.length > 0) {
    if (verbose) {
      console.log(`Starting download of ${media.length} files to ${outputDir}`);
    }
    const downloadedFiles = await batchDownloadFiles(media, outputDir, useUUID);
    if (verbose) {
      console.log(`Successfully downloaded ${downloadedFiles.length} files`);
    }
    return downloadedFiles;
  } else {
    console.log(`No media found on ${site} for the given keyword and type.`);
    return [];
  }
}

export { searchAndDownloadMedia };
