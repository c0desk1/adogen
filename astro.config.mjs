// @ts-check
import { 
  defineConfig, 
  fontProviders, 
  passthroughImageService 
} from 'astro/config';

import { SITE } from './src/consts';

import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import cloudflare from '@astrojs/cloudflare';
import mdx from '@astrojs/mdx';

import { satteri } from '@astrojs/markdown-satteri';
import { 
  transformerNotationDiff, 
  transformerNotationHighlight, 
  transformerNotationWordHighlight,
  transformerNotationErrorLevel,
  transformerMetaHighlight,
  transformerRemoveLineBreak,
  transformerMetaWordHighlight
} from '@shikijs/transformers'

import { satteriCallout } from './src/lib/mdx/satteri-callout';
import { satteriQuote } from './src/lib/mdx/satteri-blockquote';
import { satteriSteps } from './src/lib/mdx/satteri-steps';
import { satteriChangelog } from './src/lib/mdx/satteri-changelog';
import { satteriDetails } from './src/lib/mdx/satteri-details';
import { satteriKbd } from './src/lib/mdx/satteri-kbd';
import { satteriCodeBlock } from './src/lib/mdx/satteri-code-block';
import { satteriFigure } from './src/lib/mdx/satteri-figure';
import { satteriFileTree } from './src/lib/mdx/satteri-filetree';
import { remarkHeadingId } from './src/lib/mdx/remark-heading-id';

// https://astro.build/config
export default defineConfig({
  site: SITE.url,
  base: "/",
  trailingSlash: 'never',
  output: "static",
  integrations: [
    react(), 
    mdx()
  ],
 
  vite: {
    plugins: [tailwindcss()]
  },

  build: {
    inlineStylesheets: 'auto'
  },
  
  fonts: [
    {
      provider: fontProviders.local(),
      name: 'Geist',
      cssVariable: '--font-Geist',
      options: {
        variants: [
          {
            src: ['./src/assets/fonts/Geist.woff2'],
            weight: "100 800",
            style: 'normal',
            display: 'swap',
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: 'GeistMono',
      cssVariable: '--font-GeistMono',
      options: {
        variants: [
          {
            src: ['./src/assets/fonts/GeistMono.woff2'],
            weight: "100 800",
            style: 'normal',
            display: 'swap',
          },
        ],
      },
    },
  ],

  image: {
    remotePatterns: [{ protocol: "https" }],
    service: passthroughImageService()
  },

  markdown: {
    processor: satteri({
      features: { 
        directive: true,
        gfm: true,
        math: true,
        frontmatter: true,
      },
      mdastPlugins: [
        remarkHeadingId,
        satteriFigure,
        satteriQuote,
        satteriCodeBlock,
        satteriKbd,
        satteriCallout,
        satteriSteps,
        satteriChangelog,
        satteriDetails,
        satteriFileTree,
      ]
      
    }),
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      transformers: [
        transformerMetaHighlight(),
        transformerMetaWordHighlight(),
        transformerNotationDiff({matchAlgorithm: 'v3', }),
        transformerNotationHighlight({matchAlgorithm: 'v3', }),
        transformerNotationWordHighlight({matchAlgorithm: 'v3', }),
        transformerNotationErrorLevel({matchAlgorithm: 'v3', }),
        transformerRemoveLineBreak(),
      ],
      wrap: false,
    },
    syntaxHighlight: 'shiki',
  },
});