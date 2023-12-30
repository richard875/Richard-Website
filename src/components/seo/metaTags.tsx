import React from "react";
import {
  NAME,
  HTTPS,
  URL,
  GITHUB_URL,
  LINKEDIN_URL,
  ORGANIZATION,
  SITE_KEYWORDS,
  DESCRIPTION_INTRO,
  DESCRIPTION_INDEX,
  DESCRIPTION_CONTACT,
  DESCRIPTION_PROJECTS,
  DESCRIPTION_EDUCATION,
  DESCRIPTION_NOT_FOUND,
  DESCRIPTION_EXPERIENCE,
  DESCRIPTION_ACKNOWLEDGEMENT,
} from "../../constants/meta";
import Route from "../../routes/route";

const MetaTags = ({
  name,
  path,
  MetaImage,
}: {
  name: string;
  path: Route;
  MetaImage: any;
}) => {
  const today = new Date();
  const fiveDaysAgo = new Date(today.setDate(today.getDate() - 5));
  const dateString = fiveDaysAgo.toISOString().slice(0, 10);
  const linkPath = path === Route.Home ? "" : path;

  const description = () => {
    switch (path) {
      case Route.Home:
        return DESCRIPTION_INDEX;
      case Route.Acknowledgement:
        return DESCRIPTION_ACKNOWLEDGEMENT;
      case Route.Intro:
        return DESCRIPTION_INTRO;
      case Route.Experience:
        return DESCRIPTION_EXPERIENCE;
      case Route.Projects:
        return DESCRIPTION_PROJECTS;
      case Route.Education:
        return DESCRIPTION_EDUCATION;
      case Route.Contact:
        return DESCRIPTION_CONTACT;
      default:
        return DESCRIPTION_NOT_FOUND;
    }
  };

  return (
    <>
      <meta charSet="utf-8" />
      {/* Primary Meta Tags */}
      <meta name="title" content={name} />
      <meta name="description" content={description()} />
      <meta name="keywords" content={SITE_KEYWORDS} />
      <meta name="author" content={NAME} />
      <meta property="image" content={`${HTTPS}${URL}${MetaImage}`} />
      <meta property="article:published_time" content={dateString} />

      {/* Google / Search Engine Tags */}
      <meta itemProp="name" content={name} />
      <meta itemProp="description" content={description()} />
      <meta itemProp="keywords" content={SITE_KEYWORDS} />
      <meta itemProp="image" content={`${HTTPS}${URL}${MetaImage}`} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`${HTTPS}${URL}${linkPath}`} />
      <meta property="og:title" content={name} />
      <meta property="og:description" content={description()} />
      <meta property="og:keywords" content={SITE_KEYWORDS} />
      <meta property="og:image" content={`${HTTPS}${URL}${MetaImage}`} />
      <meta property="og:image:alt" content={NAME} />
      <meta property="og:published_time" content={dateString} />

      {/* Twitter */}
      <meta name="twitter:widgets:theme" content="light" />
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={`${HTTPS}${URL}${linkPath}`} />
      <meta property="twitter:title" content={name} />
      <meta property="twitter:description" content={description()} />
      <meta property="twitter:keywords" content={SITE_KEYWORDS} />
      <meta property="twitter:image" content={`${HTTPS}${URL}${MetaImage}`} />

      {/* Canonical URL */}
      <link rel="canonical" href={`${HTTPS}${URL}${linkPath}`} />

      {/* Google Rich Results */}
      <script type="application/ld+json">
        {`
            {
                "@context": "${HTTPS}schema.org/",
                "@type": "Person",
                "name": "${NAME}",
                "url": "${HTTPS}${URL}${linkPath}",
                "image": "${HTTPS}${URL}${MetaImage}",
                "sameAs": [
                    "${HTTPS}${URL}${linkPath}",
                    "${LINKEDIN_URL}",
                    "${GITHUB_URL}"
                ],
                "datePublished": "${dateString}",
                "dateModified": "${dateString}",
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
