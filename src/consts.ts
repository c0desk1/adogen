// src/consts.ts
type NavItem = {
  label: string;
  href: string;
  isExternal?: boolean;
  children?: NavItem[];
};

type FooterNav = {
  title?: string;
  items: NavItem[];
};

type ToolsNav = {
  label: string;
  href: string;
  icon?: string;
};

const LOGO = "/org/c0desk1-logo.svg";
const AUTHOR = "/org/placeholder-user.jpg";
const ThumbnailPlaceHolder = `/org/placeholder.svg`;
const OGIMAGE = "/org/c0desk1-og.webp";

export const UI_TEXT = {
  GENERATE: "Generate Metadata",
  GENERATING: "Generating...",
  COPY: "Copy",
  COPIED: "Copied!",
  EXPORT_CSV: "Export CSV",
  DROP_IMAGE: "Drop image here or click to upload",
  API_KEY_PLACEHOLDER: "Your API key (gsk_...)",
  NO_RESULTS: "No results yet. Upload an image and click Generate.",
  ERROR_API_KEY: "API Key is required",
};

export const SITE = {
  name: "Adogen",
  tagline: "AI Metadata Generator for Microstock",
  description:
    "Generate SEO-optimized titles, keywords, and categories for Adobe Stock images instantly. Bring your own API key — supports Groq, Mistral, and more.",
  url: "https://adogen.c0desk1.my.id",
  ogImage: OGIMAGE,
  locale: "en_US",
  lang: "en",
  dir: "ltr",
  charset: "utf-8",
  themeColor: "#10b981",
  bgColor: "#ffffff",
  email: "hello@adogen.dev",
  foundingYear: 2026,
} as const;

export const ORG = {
  name: "Adogen",
  url: SITE.url,
  logo: LOGO,
  sameAs: [] as string[],
} as const;

export const ROUTES = {
  home: "/",
  about: "/about",
  upscale: "/upscale",
  metadata: "/metadata",
  docs: "/docs",
  privacy: "/privacy",
  terms: "/terms",
  sitemap: "/sitemap-index.xml",
  feed: "/feed.xml",
  feedAtom: "/feed.atom",
  feedJson: "/feed.json",
  rss: "/rss.xml",
  robots: "/robots.txt",
} as const;

export const NAV = {
  navBar: [
    { label: "Metadata Generator", href: "/metadata", icon: "askAIAgent" },
    { label: "Image Upscale", href: "/upscale", icon: "blog" },
    { label: "Docs", href: ROUTES.docs },
    { label: "About", href: ROUTES.about },
  ] as NavItem[],
  mobileNavBar: [
    { label: "Docs", href: ROUTES.docs },
    { label: "About", href: ROUTES.about },
    { label: "Metadata Generator", href: "/metadata", icon: "askAIAgent" },
    { label: "Image Upscale", href: "/upscale", icon: "blog" }
  ] as NavItem[],
  footerBar: [
    { 
      title: "Tools",
      items: [
        { label: "Metadata Generator", href: ROUTES.metadata },
        { label: "Upscale Image", href: ROUTES.upscale },
      ],
    },
    {
      title: "Resource",
      items: [
        { label: "Docs", href: ROUTES.docs },
        { label: "About", href: ROUTES.about },
        { label: "Sitemap", href: ROUTES.sitemap },
      ],
    },
    {
      title: "Legal",
      items: [
        { label: "Privacy Policy", href: ROUTES.privacy },
        { label: "Terms of Service", href: ROUTES.terms },
      ],
    },
  ] as FooterNav[],
  toolsNav: [
    { label: "Metadata Generator", href: "/metadata", icon: "askAIAgent" },
    { label: "Image Upscale", href: "/upscale", icon: "blog" }
  ] as ToolsNav[]
} as const;

export const SEO = {
  titleDefault: SITE.name,
  titleTemplate: `%s | ${SITE.name}`,
  titleMaxLength: 60,
  description: SITE.description,
  descriptionMaxLength: 160,
  canonical: SITE.url,
  ogImage: OGIMAGE,
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageAlt: `${SITE.name} — ${SITE.tagline}`,
  twitterCard: "summary_large_image" as const,
  twitterSite: "@adogen_tool",
  twitterCreator: "@adogen_tool",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      maxVideoPreview: -1,
      maxImagePreview: "large" as const,
      maxSnippet: -1,
    },
  },
  verification: {
    google: "",
    bing: "",
    yandex: "",
  },
} as const;

export const OG = {
  type: "website" as const,
  siteName: SITE.name,
  locale: SITE.locale,
  image: SEO.ogImage,
  imageWidth: SEO.ogImageWidth,
  imageHeight: SEO.ogImageHeight,
  imageAlt: SEO.ogImageAlt,
} as const;

export const TWITTER = {
  card: SEO.twitterCard,
  site: SEO.twitterSite,
  creator: SEO.twitterCreator,
} as const;

// ----------------------------------------------------------------------------
//  STRUCTURED DATA
// ----------------------------------------------------------------------------
export const schemaWebSite = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE.name,
  url: SITE.url,
  description: SITE.description,
  inLanguage: SITE.lang,
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: `${SITE.url}/search?q={search_term_string}`,
    },
    "query-input": "required name=search_term_string",
  },
} as const;

export const schemaOrganization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: ORG.name,
  url: ORG.url,
  logo: {
    "@type": "ImageObject",
    url: ORG.logo,
    width: 512,
    height: 512,
  },
  sameAs: ORG.sameAs,
  contactPoint: {
    "@type": "ContactPoint",
    email: SITE.email,
    contactType: "customer support",
    availableLanguage: ["English"],
  },
} as const;

export function schemaBreadcrumb(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function schemaWebPage(opts: {
  title: string;
  description: string;
  url: string;
  type?: "WebPage" | "AboutPage" | "ContactPage" | "CollectionPage";
  dateModified?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": opts.type ?? "WebPage",
    name: opts.title,
    description: opts.description,
    url: opts.url,
    inLanguage: SITE.lang,
    isPartOf: {
      "@type": "WebSite",
      "@id": `${SITE.url}/#website`,
    },
    ...(opts.dateModified ? { dateModified: opts.dateModified } : {}),
  };
}

export function schemaSoftwareApplication(opts: {
  name: string;
  description: string;
  url: string;
  image: string | string[];
  operatingSystem?: string;
  applicationCategory?: string;
  price?: string;
  priceCurrency?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: opts.name,
    description: opts.description,
    url: opts.url,
    image: opts.image,
    operatingSystem: opts.operatingSystem || "All",
    applicationCategory: opts.applicationCategory || "WebApplication",
    offers: {
      "@type": "Offer",
      price: opts.price || "0",
      priceCurrency: opts.priceCurrency || "USD",
    },
  };
}

export function schemaFAQ(items: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

// ----------------------------------------------------------------------------
//  buildMeta
// ----------------------------------------------------------------------------
export function buildMeta(opts: {
  title?: string;
  description?: string;
  canonical?: string;
  ogImage?: string;
  ogImageAlt?: string;
  ogType?: "website" | "article";
  noindex?: boolean;
  nofollow?: boolean;
  datePublished?: string;
  dateModified?: string;
  authorName?: string;
  keywords?: string[];
}) {
  const title = opts.title
    ? SEO.titleTemplate.replace("%s", opts.title).slice(0, SEO.titleMaxLength + 20)
    : SEO.titleDefault;
  const description = (opts.description ?? SEO.description).slice(0, SEO.descriptionMaxLength);
  const canonical = opts.canonical ?? SEO.canonical;
  const ogImage = opts.ogImage ?? SEO.ogImage;
  const ogImageAlt = opts.ogImageAlt ?? SEO.ogImageAlt;
  const ogType = opts.ogType ?? OG.type;
  const noindex = opts.noindex ?? !SEO.robots.index;
  const nofollow = opts.nofollow ?? !SEO.robots.follow;
  const robotsContent = [
    noindex ? "noindex" : "index",
    nofollow ? "nofollow" : "follow",
    "max-snippet:-1",
    "max-image-preview:large",
    "max-video-preview:-1",
  ].join(", ");
  return {
    title,
    description,
    canonical,
    robots: robotsContent,
    keywords: opts.keywords?.join(", ") ?? "",
    og: {
      title,
      description,
      url: canonical,
      type: ogType,
      siteName: OG.siteName,
      locale: OG.locale,
      image: ogImage,
      imageWidth: OG.imageWidth,
      imageHeight: OG.imageHeight,
      imageAlt: ogImageAlt,
      ...(opts.datePublished ? { publishedTime: opts.datePublished } : {}),
      ...(opts.dateModified ? { modifiedTime: opts.dateModified } : {}),
      ...(opts.authorName ? { author: opts.authorName } : {}),
    },
    twitter: {
      card: TWITTER.card,
      site: TWITTER.site,
      creator: TWITTER.creator,
      title,
      description,
      image: ogImage,
      imageAlt: ogImageAlt,
    },
  };
}

// ----------------------------------------------------------------------------
//  PAGINATION
// ----------------------------------------------------------------------------
export const PAGINATION = {
  postsPerPage: 12,
  postsPerFeed: 20,
  postsPerSitemap: 1000,
} as const;

// ----------------------------------------------------------------------------
//  IMAGE DEFAULTS (for website, not for processing)
// ----------------------------------------------------------------------------
export const IMAGE = {
  og: {
    width: 1200,
    height: 630,
    placeholder: OG
  },
  thumbnail: {
    width: 800,
    height: 450,
    quality: 80,
    placeholder: ThumbnailPlaceHolder,
  },
  avatar: {
    width: 96,
    height: 96,
    quality: 80,
    placeholder: AUTHOR
  },
  logo: {
    width: 512,
    height: 512,
  },
} as const;

export const DATE_FORMAT: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "long",
  day: "numeric",
} as const;

export function formatDate(date: Date | string, short = false): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const options: Intl.DateTimeFormatOptions = short
    ? { month: "short", day: "numeric" }
    : DATE_FORMAT;
  return d.toLocaleDateString(SITE.locale.replace("_", "-"), options);
}

export function toISOString(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toISOString();
}
