import type { GatsbyConfig } from "gatsby";

require("dotenv").config({
  path: `.env.${process.env.NODE_ENV}`,
});

const config: GatsbyConfig = {
  siteMetadata: {
    title: `richard-website`,
    siteUrl: `https://www.yourdomain.tld`,
  },
  // More easily incorporate content into your pages through automatic TypeScript type generation and better GraphQL IntelliSense.
  // If you use VSCode you can also use the GraphQL plugin
  // Learn more at: https://gatsby.dev/graphql-typegen
  graphqlTypegen: true,
  plugins: [
    "gatsby-plugin-postcss",
    "gatsby-plugin-netlify",
    "gatsby-plugin-no-sourcemaps",
    "gatsby-plugin-styled-components",
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
    "gatsby-plugin-sass",
    "gatsby-plugin-image",
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        icon: `static/images/favicon.png`,
      },
    },
    "gatsby-plugin-sharp",
    "gatsby-transformer-sharp",
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `Richard Lee | Software Engineer | University of Sydney`,
        short_name: `Richard Lee`,
        start_url: `/?mode=standalone`,
        background_color: `#BAE6C3`,
        theme_color: `#F5EDE3`,
        display: `standalone`,
        icon: `static/images/pwas/pwa-1024.png`,
        include_favicon: false,
      },
    },
    "gatsby-plugin-offline",
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `./static/images/`,
      },
      __key: `images`,
    },
  ],
};

export default config;
