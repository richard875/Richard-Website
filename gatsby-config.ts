import dotenv from "dotenv";
import type { GatsbyConfig } from "gatsby";
import Color from "./src/enums/color";
import {
  NAME,
  MODE,
  HTTPS,
  SITE_TITLE,
  STANDALONE,
  DESCRIPTION_INDEX,
} from "./src/constants/meta";

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });
const SITE_DOMAIN = process.env.GATSBY_SITE_URL;
const SITE_URL = `${HTTPS}${SITE_DOMAIN}`;

const config: GatsbyConfig = {
  trailingSlash: "always",
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
  // HTTP headers are served from Cloudflare Pages' own _headers mechanism
  // (see static/_headers) rather than from this config — Cloudflare Pages
  // doesn't read Gatsby's `headers` field, and the gatsby-plugin-netlify
  // adapter that used to bridge this (from when the site was on Netlify)
  // was silently dropping half these headers anyway.
  plugins: [
    "gatsby-plugin-sass",
    "gatsby-plugin-image",
    "gatsby-plugin-sharp",
    "gatsby-plugin-postcss",
    "gatsby-transformer-sharp",
    {
      resolve: "gatsby-plugin-styled-components",
      options: { displayName: true },
    },
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
        name: NAME,
        short_name: NAME,
        lang: "en",
        start_url: `/?${MODE}=${STANDALONE}`,
        background_color: "#BAE6C3",
        theme_color: Color.BACKGROUND_WHITE,
        display: STANDALONE,
        icon: "static/images/favicon.png",
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
        // host: null, not omitted -- omitting it falls back to
        // siteMetadata.siteUrl. Google explicitly ignores the Host directive
        // in robots.txt (confirmed via Search Console: "Rule ignored by
        // Googlebot") and Yandex is the only crawler that ever honoured it.
        host: null,
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
            "'self' 'unsafe-inline' 'unsafe-eval' www.googletagmanager.com www.clarity.ms static.cloudflareinsights.com",
          "style-src": "'self' 'unsafe-inline'",
          "img-src":
            "'self' data: c.clarity.ms c.bing.com www.google.com.au/ads/ga-audiences",
          "connect-src":
            "'self' analytics.google.com e.clarity.ms stats.g.doubleclick.net cloudflareinsights.com",
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
