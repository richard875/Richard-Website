import dotenv from "dotenv";
import type { GatsbyConfig } from "gatsby";
import Color from "./src/enums/color";
import {
  NAME,
  MODE,
  HTTPS,
  SITE_TITLE,
  STANDALONE,
  RESUME_FILE,
  DESCRIPTION_INDEX,
} from "./src/constants/meta";

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
const SITE_DOMAIN = process.env.GATSBY_SITE_URL;
const SITE_URL = `${HTTPS}${SITE_DOMAIN}`;

const config: GatsbyConfig = {
  trailingSlash: "never",
  siteMetadata: {
    title: SITE_TITLE,
    description: DESCRIPTION_INDEX,
    image: "static/images/splash/apple-splash-2224-1668.jpg",
    siteUrl: SITE_URL,
  },
  // More easily incorporate content into your pages through automatic TypeScript type generation and better GraphQL IntelliSense.
  // If you use VSCode you can also use the GraphQL plugin
  // Learn more at: https://gatsby.dev/graphql-typegen
  graphqlTypegen: true,
  flags: {
    DEV_SSR: true,
  },
  headers: [
    {
      source: `/${RESUME_FILE}`,
      headers: [
        {
          key: "Link",
          value: `<${SITE_URL}/${RESUME_FILE}>; rel="canonical"`,
        },
      ],
    },
    {
      source: "*",
      headers: [
        {
          key: "Strict-Transport-Security",
          value: "max-age=31536000; includeSubdomains",
        },
        {
          key: "X-Frame-Options",
          value: "DENY",
        },
        {
          key: "X-Content-Type-Options",
          value: "nosniff",
        },
        {
          key: "X-XSS-Protection",
          value: "1; mode=block",
        },
        {
          key: "Referrer-Policy",
          value: "same-origin",
        },
        {
          key: "Permissions-Policy",
          value: "camera=(), microphone=(), geolocation=()",
        },
        {
          key: "Access-Control-Allow-Origin",
          value: SITE_URL,
        },
        {
          key: "Vary",
          value: "Origin",
        },
      ],
    },
  ],
  plugins: [
    "gatsby-plugin-sass",
    "gatsby-plugin-image",
    "gatsby-plugin-sharp",
    "gatsby-plugin-netlify",
    "gatsby-plugin-postcss",
    "gatsby-transformer-sharp",
    "babel-plugin-styled-components",
    "gatsby-plugin-styled-components",
    {
      resolve: "gatsby-plugin-sitemap",
      options: { resolveSiteUrl: () => SITE_URL },
    },
    {
      resolve: "gatsby-plugin-google-tagmanager",
      options: { id: process.env.TAG_ID },
    },
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        icon: "static/images/favicon.png",
        icon_options: { purpose: "any maskable" },
      },
    },
    {
      resolve: "gatsby-plugin-manifest",
      options: {
        name: NAME,
        short_name: NAME,
        lang: "en",
        start_url: `/?${MODE}=${STANDALONE}`,
        background_color: "#BAE6C3",
        theme_color: Color.BACKGROUND_WHITE,
        display: STANDALONE,
        icon: "static/images/pwas/pwa-1024.png",
        include_favicon: false,
        theme_color_in_head: false,
        cache_busting_mode: "none",
        icon_options: { purpose: "any maskable" },
      },
    },
    {
      resolve: "gatsby-source-filesystem",
      options: {
        name: "images",
        path: "./static/images/",
      },
      __key: "images",
    },
    {
      resolve: "gatsby-plugin-brotli",
      options: { extensions: ["css", "html", "js", "svg", "json"] },
    },
    {
      resolve: "gatsby-plugin-robots-txt",
      options: {
        host: SITE_URL,
        sitemap: `${SITE_URL}/sitemap-index.xml`,
        policy: [{ userAgent: "*", allow: "/" }],
      },
    },
    {
      resolve: "gatsby-plugin-csp",
      options: {
        disableOnDev: true,
        reportOnly: false,
        mergeScriptHashes: false,
        mergeStyleHashes: false,
        mergeDefaultDirectives: false,
        directives: {
          "script-src":
            "'self' 'unsafe-inline' 'unsafe-eval' www.googletagmanager.com www.clarity.ms",
          "style-src": "'self' 'unsafe-inline'",
          "img-src":
            "'self' data: c.clarity.ms c.bing.com www.google.com.au/ads/ga-audiences",
          "connect-src":
            "'self' analytics.google.com e.clarity.ms stats.g.doubleclick.net",
          "font-src": "'self'",
          "object-src": "'none'",
          "media-src": "'self'",
          "frame-src": "'self' td.doubleclick.net",
          "base-uri": "'self'",
          "worker-src": "'self'",
          "manifest-src": "'self'",
          "upgrade-insecure-requests": " ",
          "block-all-mixed-content": " ",
        },
      },
    },
    {
      resolve: "gatsby-plugin-no-sourcemaps",
    },
  ],
};

export default config;
