/**
 * Generate flag URL from country code using flagcdn.com
 * @param countryCode - ISO 3166-1 alpha-2 country code (e.g., 'us', 'gb', 'ua')
 * @param size - Size format: '16x12', '32x24', '48x36', '64x48', '128x96', '256x192'
 * @param format - Image format: 'webp' (default, recommended) or 'png'
 * @returns Full URL to flag image
 */
export const getFlagUrl = (
  countryCode: string,
  size:
    | '16x12'
    | '32x24'
    | '48x36'
    | '64x48'
    | '128x96'
    | '256x192' = '256x192',
  format: 'webp' | 'png' = 'webp',
): string => {
  return `https://flagcdn.com/${size}/${countryCode.toLowerCase()}.${format}`;
};

/**
 * Get high resolution flag URL (256x192) in WebP format
 * WebP provides 25-35% smaller file size compared to PNG
 */
export const getFlagUrlHD = (countryCode: string): string => {
  return getFlagUrl(countryCode, '256x192', 'webp');
};

/**
 * Get medium resolution flag URL (128x96) in WebP format
 * WebP provides 25-35% smaller file size compared to PNG
 */
export const getFlagUrlMD = (countryCode: string): string => {
  return getFlagUrl(countryCode, '128x96', 'webp');
};

/**
 * Get small resolution flag URL (64x48) in WebP format
 * WebP provides 25-35% smaller file size compared to PNG
 */
export const getFlagUrlSM = (countryCode: string): string => {
  return getFlagUrl(countryCode, '64x48', 'webp');
};
