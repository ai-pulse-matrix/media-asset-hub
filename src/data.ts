interface MediaData {
  provider: string;
  keyword: string;
  url: string;
  duration: number | null;
  mediaType: 'video' | 'photo';
}

export { MediaData };
