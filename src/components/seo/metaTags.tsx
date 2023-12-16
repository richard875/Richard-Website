import React from "react";
import {
  NAME,
  URL,
  LINKEDIN_URL,
  GITHUB_URL,
  ORGANIZATION,
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
} from "../../constants/meta";
import favicon from "../../../static/images/favicon.png";
import { COLOR } from "../../styles/theme";

const MetaTags = ({
  name,
  path,
  MetaImage,
}: {
  name: string;
  path: string;
  MetaImage: any;
}) => {
  const today = new Date();
  const fiveDaysAgo = new Date(today.setDate(today.getDate() - 5));
  const dateString = fiveDaysAgo.toISOString().slice(0, 10);

  return (
    <>
      <meta charSet="utf-8" />
      {/* Primary Meta Tags */}
      <meta name="title" content={name} />
      <meta name="description" content={SITE_DESCRIPTION} />
      <meta name="keywords" content={SITE_KEYWORDS} />
      <meta name="author" content={NAME} />
      <meta property="image" content={`https://${URL}${MetaImage}`} />
      <meta property="article:published_time" content={dateString} />

      {/* Google / Search Engine Tags */}
      <meta itemProp="name" content={name} />
      <meta itemProp="description" content={SITE_DESCRIPTION} />
      <meta itemProp="keywords" content={SITE_KEYWORDS} />
      <meta itemProp="image" content={`https://${URL}${MetaImage}`} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`https://${URL}${path}`} />
      <meta property="og:title" content={name} />
      <meta property="og:description" content={SITE_DESCRIPTION} />
      <meta property="og:keywords" content={SITE_KEYWORDS} />
      <meta property="og:image" content={`https://${URL}${MetaImage}`} />
      <meta property="og:image:alt" content={NAME} />
      <meta property="og:published_time" content={dateString} />

      {/* Twitter */}
      <meta name="twitter:widgets:theme" content="light" />
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={`https://${URL}${path}`} />
      <meta property="twitter:title" content={name} />
      <meta property="twitter:description" content={SITE_DESCRIPTION} />
      <meta property="twitter:keywords" content={SITE_KEYWORDS} />
      <meta property="twitter:image" content={`https://${URL}${MetaImage}`} />

      {/* Favicons */}
      <link rel="mask-icon" href={favicon} color={COLOR.BACKGROUND_WHITE} />

      {/* Google Rich Results */}
      <script type="application/ld+json">
        {`
            {
                "@context": "https://schema.org/",
                "@type": "Person",
                "name": "${NAME}",
                "url": "https://${URL}${path}",
                "image": "https://${URL}${MetaImage}",
                "sameAs": [
                    "https://${URL}${path}",
                    "${LINKEDIN_URL}",
                    "${GITHUB_URL}"
                ],
                "jobTitle": "Software Engineer",
                "worksFor": {
                    "@type": "Organization",
                    "name": "${ORGANIZATION}"
                }
            }
        `}
      </script>
    </>
  );
};

export default MetaTags;
