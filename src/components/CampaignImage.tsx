import manifest from '@/lib/campaign-assets.json';

type Asset = { width: number; height: number; variants: { width: number; height: number; avif: string; webp: string }[] };
const assets = manifest as Record<string, Asset>;
const sources = (asset: Asset, format: 'avif' | 'webp') => asset.variants.map(item => `${item[format]} ${item.width}w`).join(', ');

export function CampaignImage({ name, alt, className = '', sizes = '100vw', priority = false, mobileName }: { name: string; alt: string; className?: string; sizes?: string; priority?: boolean; mobileName?: string }) {
  const asset = assets[name], mobile = mobileName ? assets[mobileName] : undefined;
  if (!asset) return null;
  const fallback = asset.variants.find(item => item.width >= 960) ?? asset.variants[asset.variants.length - 1];
  return <picture className={`v8-image ${className}`}>
    {mobile && <><source media="(max-width: 950px)" type="image/avif" srcSet={sources(mobile, 'avif')} sizes="100vw" /><source media="(max-width: 950px)" type="image/webp" srcSet={sources(mobile, 'webp')} sizes="100vw" /></>}
    <source type="image/avif" srcSet={sources(asset, 'avif')} sizes={sizes} />
    <img src={fallback.webp} srcSet={sources(asset, 'webp')} sizes={sizes} width={asset.width} height={asset.height} alt={alt} loading={priority ? 'eager' : 'lazy'} fetchPriority={priority ? 'high' : undefined} decoding="async" />
  </picture>;
}
