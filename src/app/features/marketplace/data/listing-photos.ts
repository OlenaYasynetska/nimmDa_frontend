export function listingPhotos(item: { imageSrc?: string; images?: string[] | null }): string[] {
  const photos = (item.images ?? []).map((src) => src.trim()).filter(Boolean).slice(0, 5);
  if (photos.length > 0) {
    return photos;
  }
  const cover = item.imageSrc?.trim();
  return cover ? [cover] : [];
}
