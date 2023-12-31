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
const SITE_URL = `${HTTPS}${process.env.GATSBY_SITE_URL}`;

const config: GatsbyConfig = {
  trailingSlash: "never",
  siteMetadata: {
    title: SITE_TITLE,
    description: DESCRIPTION_INDEX,
    image: `static/images/splash/apple-splash-2224-1668.jpg`,
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
      source: "/richard-lee-resume.pdf",
      headers: [
        {
          key: "Link",
          value: `<${SITE_URL}/richard-lee-resume.pdf>; rel="canonical"`,
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
    `gatsby-plugin-postcss`,
    {
      resolve: `gatsby-plugin-sitemap`,
      options: { resolveSiteUrl: () => SITE_URL },
    },
    `gatsby-plugin-netlify`,
    "babel-plugin-styled-components",
    `gatsby-plugin-styled-components`,
    {
      resolve: "gatsby-plugin-google-tagmanager",
      options: {
        id: `${process.env.TAG_ID}`,
      },
    },
    `gatsby-plugin-sass`,
    `gatsby-plugin-image`,
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        icon: `static/images/favicon.png`,
        icon_options: {
          purpose: `any maskable`,
        },
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: NAME,
        short_name: NAME,
        lang: "en",
        start_url: `/?${MODE}=${STANDALONE}`,
        background_color: `#BAE6C3`,
        theme_color: Color.BACKGROUND_WHITE,
        display: STANDALONE,
        icon: `static/images/pwas/pwa-1024.png`,
        include_favicon: false,
        theme_color_in_head: false,
        cache_busting_mode: "query",
        icon_options: {
          purpose: `any maskable`,
        },
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `./static/images/`,
      },
      __key: `images`,
    },
    `gatsby-plugin-offline`,
    {
      resolve: "gatsby-plugin-brotli",
      options: {
        extensions: ["css", "html", "js", "svg", "json"],
      },
    },
    {
      resolve: "gatsby-plugin-robots-txt",
      options: {
        host: SITE_URL,
        sitemap: `${SITE_URL}/sitemap-index.xml`,
        policy: [{ userAgent: "*", allow: "/" }],
      },
    },
  ],
};

export default config;
