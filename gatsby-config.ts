import type { GatsbyConfig } from "gatsby";
import { COLOR } from "./src/styles/theme";
import {
  NAME,
  URL,
  SITE_TITLE,
  SITE_DESCRIPTION,
  MODE,
  STANDALONE,
} from "./src/constants/meta";

require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
});

const config: GatsbyConfig = {
  siteMetadata: {
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    image: `static/images/splash/apple-splash-2224-1668.jpg`,
    siteUrl: `https://${URL}`,
  },
  // More easily incorporate content into your pages through automatic TypeScript type generation and better GraphQL IntelliSense.
  // If you use VSCode you can also use the GraphQL plugin
  // Learn more at: https://gatsby.dev/graphql-typegen
  graphqlTypegen: true,
  plugins: [
    `gatsby-plugin-postcss`,
    `gatsby-plugin-sitemap`,
    `gatsby-plugin-netlify`,
    `gatsby-plugin-no-sourcemaps`,
    `gatsby-plugin-styled-components`,
    {
      resolve: `gatsby-plugin-google-gtag`,
      options: {
        trackingIds: [process.env.STREAM_ID, process.env.GA_ID],
        pluginConfig: {
          head: true,
          anonymize: true,
        },
      },
    },
    `gatsby-plugin-sass`,
    `gatsby-plugin-image`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        icon: `static/images/favicon.png`,
      },
    },
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: SITE_TITLE,
        short_name: NAME,
        start_url: `/?${MODE}=${STANDALONE}`,
        background_color: `#BAE6C3`,
        theme_color: COLOR.BACKGROUND_WHITE,
        display: STANDALONE,
        icon: `static/images/pwas/pwa-1024.png`,
        include_favicon: false,
        theme_color_in_head: false,
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
  ],
};

export default config;
