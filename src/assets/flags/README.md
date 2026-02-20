# Flag Images

This app uses **flagcdn.com** API to load flag images dynamically. No local images needed!

## How It Works

Flags are loaded from: `https://flagcdn.com/256x192/{country_code}.webp`

Example: `https://flagcdn.com/256x192/ua.webp` for Ukraine 🇺🇦

## Why WebP?

The app uses **WebP format** for optimal performance:

- **25-35% smaller** file size than PNG
- **Faster loading** times
- **Better compression** with same quality
- **Reduced bandwidth** usage
- **Full transparency** support
- **Supported** by all modern devices and React Native

### File Size Comparison

| Format | Size (256x192) | Bandwidth Saved |
| ------ | -------------- | --------------- |
| PNG    | ~20-25 KB      | -               |
| WebP   | ~12-15 KB      | 35-40%          |

For a 10-question game:

- PNG: ~250 KB total
- WebP: ~150 KB total
- **Savings: 100 KB (40%)**

## Country Codes (ISO 3166-1 alpha-2)

The database stores country codes (without extension) that map to flag images:

### Americas

- `us` - United States
- `ca` - Canada
- `br` - Brazil
- `mx` - Mexico
- `ar` - Argentina
- `cl` - Chile
- `co` - Colombia
- `pe` - Peru
- `ve` - Venezuela

### Europe

- `gb` - United Kingdom
- `fr` - France
- `de` - Germany
- `it` - Italy
- `es` - Spain
- `ru` - Russia
- `nl` - Netherlands
- `se` - Sweden
- `no` - Norway
- `dk` - Denmark
- `fi` - Finland
- `pl` - Poland
- `ua` - Ukraine
- `gr` - Greece
- `pt` - Portugal
- `be` - Belgium
- `ch` - Switzerland
- `at` - Austria
- `cz` - Czech Republic
- `ie` - Ireland
- `tr` - Turkey

### Asia

- `jp` - Japan
- `cn` - China
- `in` - India
- `kr` - South Korea
- `sg` - Singapore
- `th` - Thailand
- `vn` - Vietnam
- `id` - Indonesia
- `my` - Malaysia
- `ph` - Philippines
- `sa` - Saudi Arabia
- `ae` - United Arab Emirates
- `il` - Israel

### Africa

- `za` - South Africa
- `eg` - Egypt
- `ng` - Nigeria
- `ke` - Kenya
- `ma` - Morocco

### Oceania

- `au` - Australia
- `nz` - New Zealand

## Available Sizes

The flagcdn.com API supports multiple sizes (all in WebP format):

| Size      | Dimensions | File Size | Usage          |
| --------- | ---------- | --------- | -------------- |
| `16x12`   | 16×12px    | ~1 KB     | Tiny icons     |
| `32x24`   | 32×24px    | ~2 KB     | Small icons    |
| `48x36`   | 48×36px    | ~3 KB     | Medium icons   |
| `64x48`   | 64×48px    | ~4 KB     | Large icons    |
| `128x96`  | 128×96px   | ~8 KB     | Results screen |
| `256x192` | 256×192px  | ~15 KB    | Game screen    |

## Format Support

### WebP (Default - Recommended)

```typescript
getFlagUrlHD('us'); // Returns WebP URL
// https://flagcdn.com/256x192/us.webp
```

### PNG (Fallback)

```typescript
getFlagUrl('us', '256x192', 'png'); // Returns PNG URL
// https://flagcdn.com/256x192/us.png
```

## Adding New Countries

To add a new country:

1. Find the ISO 3166-1 alpha-2 code (e.g., `jp` for Japan)
2. Add to `src/database/initDB.ts`:
   ```typescript
   { name: 'Japan', region: 'Asia', difficulty: 1, flag_file: 'jp.png' }
   ```
3. The code strips `.png` extension and generates WebP URL automatically
4. The flag will load from: `https://flagcdn.com/256x192/jp.webp`

## Performance Benefits

### Network Performance

- **40% less bandwidth** per game
- **Faster loading** on slow connections
- **Better mobile experience**
- **Reduced data costs** for users

### App Performance

- **Faster rendering** with smaller images
- **Less memory** usage
- **Better caching** efficiency
- **Smoother gameplay**

## API Reference

- **Website**: https://flagcdn.com/
- **Free to use**: No API key required
- **Fast CDN**: Global edge locations
- **Always updated**: Latest flag designs
- **Format support**: WebP, PNG, SVG
- **Multiple sizes**: From 16x12 to 256x192

## Browser/Device Support

WebP is supported by:

- ✅ React Native (iOS & Android)
- ✅ Chrome/Edge (all versions)
- ✅ Firefox (all versions)
- ✅ Safari 14+ (iOS 14+)
- ✅ All modern mobile devices

## Troubleshooting

### Flags not loading?

1. Check internet connection
2. Verify country code is valid ISO 3166-1 alpha-2
3. Check if device supports WebP (all modern devices do)
4. Try PNG fallback if needed

### Slow loading?

1. Check network speed
2. WebP should load 40% faster than PNG
3. Images are cached after first load
4. CDN provides fast global delivery
