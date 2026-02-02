/**
 * Shared interface for all SEO providers (Yoast, All in One SEO, Rank Math, etc.)
 * This ensures consistent return shapes across different provider composables
 */

export interface SeoMeta {
  name?: string;
  property?: string;
  content: string;
}

export interface SeoLink {
  rel: string;
  href: string;
}

export interface SeoScript {
  type: string;
  innerHTML: string;
}

export interface SeoHeadData {
  title: string;
  meta: SeoMeta[];
  link: SeoLink[];
  script: SeoScript[];
}

export type SeoProvider = 'yoast' | 'all-in-one' | 'rank-math' | 'default';
