import fs from 'fs-extra';
import path from 'path';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { MediaData } from './data';

async function downloadFile(url: string, outputPath: string): Promise<void> {
  const writer = fs.createWriteStream(outputPath);
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream',
  });

  response.data.pipe(writer);

  return new Promise<void>((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
}

async function batchDownloadFiles(
  mediaList: MediaData[],
  outputDir: string,
  useUUID: boolean = false
): Promise<string[]> {
  await fs.ensureDir(outputDir);
  const downloadedFiles: string[] = [];

  for (const [index, media] of mediaList.entries()) {
    const fileExtension = media.mediaType === 'video' ? '.mp4' : '.jpg';
    let fileName: string;

    if (useUUID) {
      fileName = `${uuidv4()}${fileExtension}`;
    } else {
      fileName = `${media.keyword}_${index + 1}${fileExtension}`;
    }

    const filePath = path.join(outputDir, fileName);

    try {
      await downloadFile(media.url, filePath);
      console.log(`Downloaded: ${fileName}`);
      downloadedFiles.push(filePath);
    } catch (error: any) {
      console.error(`Error downloading ${fileName}:`, error.message);
    }
  }

  return downloadedFiles;
}

export { downloadFile, batchDownloadFiles };
