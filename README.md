# Media Asset Hub

Media Asset Hub is a Node.js-based web application that allows users to download high-quality images and videos from various free stock media websites.

## Features

- Download images and videos from multiple free sources
- Supported websites include Pexels, Pixabay, and more
- User-friendly interface
- Fast and efficient downloads
- No registration required

## Supported Websites

- [Pexels](https://www.pexels.com/)
- [Pixabay](https://pixabay.com/)
- [Unsplash](https://unsplash.com/)
- [Videvo](https://www.videvo.net/)

## Installation

1. Clone the repository:

   ```
   git clone https://github.com/ai-pulse-matrix/MediaAssetHub.git
   ```

2. Navigate to the project directory:

   ```
   cd ./MediaAssetHub
   ```

3. Install dependencies:

   ```
   npm install
   ```

4. Start the application:

   ```
   npm start
   ```

5. Open your browser and visit `http://localhost:3000`

## Usage Examples

Here are some examples of how to use the `searchAndDownloadMedia` function:

1. Download photos from Pexels:

```typescript
import { searchAndDownloadMedia } from 'media-asset-hub';

async function downloadPexelsPhotos() {
  await searchAndDownloadMedia({
    keyword: 'nature',
    mediaType: 'photo',
    outputDir: './downloads/nature_photos',
    site: 'pexels',
    apiKey: 'your_pexels_api_key_here',
    params: {
      perPage: 20,
      page: 1,
    },
  });
}
```

2. Download videos from Pixabay:

```typescript
typescript;
import { searchAndDownloadMedia } from 'media-asset-hub';

async function downloadPixabayVideos() {
  await searchAndDownloadMedia({
    keyword: 'city',
    mediaType: 'video',
    outputDir: './downloads/city_videos',
    site: 'pixabay',
    apiKey: 'your_pixabay_api_key_here',
    params: {
      perPage: 15,
      page: 1,
      minWidth: 1280,
      minHeight: 720,
    },
  });
}
```

Make sure to replace 'your_pexels_api_key_here' and 'your_pixabay_api_key_here' with your actual API keys.

## Technologies Used

- Node.js
- Express.js
- Axios for API requests
- Bootstrap for styling

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
