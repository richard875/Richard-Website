import * as React from "react";
import {
  NAME,
  URL,
  ORGANIZATION,
  SITE_TITLE,
  SITE_DESCRIPTION,
  SITE_KEYWORDS,
} from "../../constants/meta";
import MetaImage from "../../../static/images/splash/apple-splash-2224-1668.jpg";

const MetaTags = ({ path }: { path: string }) => {
  return (
    <>
      <meta charSet="utf-8" />
      {/* Primary Meta Tags */}
      <meta name="title" content={SITE_TITLE} />
      <meta name="description" content={SITE_DESCRIPTION} />
      <meta name="keywords" content={SITE_KEYWORDS} />
      <meta name="author" content={NAME} />
      <meta property="image" content={MetaImage} />

      {/* Google / Search Engine Tags */}
      <meta itemProp="name" content={SITE_TITLE} />
      <meta itemProp="description" content={SITE_DESCRIPTION} />
      <meta itemProp="keywords" content={SITE_KEYWORDS} />
      <meta itemProp="image" content={MetaImage} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`https://${URL}${path}`} />
      <meta property="og:title" content={SITE_TITLE} />
      <meta property="og:description" content={SITE_DESCRIPTION} />
      <meta property="og:keywords" content={SITE_KEYWORDS} />
      <meta property="og:image" content={MetaImage} />

      {/* Twitter */}
      <meta name="twitter:widgets:theme" content="light" />
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={`https://${URL}${path}`} />
      <meta property="twitter:title" content={SITE_TITLE} />
      <meta property="twitter:description" content={SITE_DESCRIPTION} />
      <meta property="twitter:keywords" content={SITE_KEYWORDS} />
      <meta property="twitter:image" content={MetaImage} />

      {/* Google Rich Results */}
      <script type="application/ld+json">
        {`
            {
                "@context": "https://schema.org/",
                "@type": "Person",
                "name": ${NAME},
                "url": "https://${URL}${path}",
                "image": ${MetaImage},
                "sameAs": [
                    "https://${URL}${path}",
                    "https://github.com/richard875",
                    "https://www.linkedin.com/in/richard875/"
                ],
                "jobTitle": "Software Engineer",
                "worksFor": {
                    "@type": "Organization",
                    "name": ${ORGANIZATION}
                }
            }
        `}
      </script>
    </>
  );
};

export default MetaTags;
