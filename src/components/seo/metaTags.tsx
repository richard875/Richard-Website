import React from "react";
import {
  NAME,
  HTTPS,
  URL,
  GITHUB_URL,
  LINKEDIN_URL,
  OCCUPATION,
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
  const dateString = "2026-08-10";
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
      <meta
        name="robots"
        content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
      />
      {/* Primary Meta Tags */}
      <meta name="title" content={name} />
      <meta name="description" content={description()} />
      <meta name="keywords" content={SITE_KEYWORDS} />
      <meta name="author" content={NAME} />
      <meta property="article:published_time" content={dateString} />

      {/* Open Graph / Facebook, LinkedIn, Slack, Discord, WhatsApp, Telegram, iMessage, Pinterest, Teams */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={`${HTTPS}${URL}${linkPath}`} />
      <meta property="og:site_name" content={NAME} />
      <meta property="og:locale" content="en_AU" />
      <meta property="og:title" content={name} />
      <meta property="og:description" content={description()} />
      <meta property="og:image" content={`${HTTPS}${URL}${MetaImage}`} />
      <meta property="og:image:secure_url" content={`${HTTPS}${URL}${MetaImage}`} />
      {/* Dimensions/type describe static/images/meta/meta-image.png — update these if that file is ever replaced */}
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:width" content="1920" />
      <meta property="og:image:height" content="1080" />
      <meta property="og:image:alt" content={NAME} />
      <meta property="og:published_time" content={dateString} />

      {/* Twitter / X */}
      <meta name="twitter:widgets:theme" content="light" />
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={`${HTTPS}${URL}${linkPath}`} />
      <meta property="twitter:title" content={name} />
      <meta property="twitter:description" content={description()} />
      <meta property="twitter:image" content={`${HTTPS}${URL}${MetaImage}`} />
      <meta property="twitter:image:alt" content={NAME} />

      {/* Canonical URL */}
      <link rel="canonical" href={`${HTTPS}${URL}${linkPath}`} />

      {/* Google Rich Results */}
      <script type="application/ld+json">
        {`
            {
                "@context": "${HTTPS}schema.org/",
                "@graph": [
                    {
                        "@type": "WebSite",
                        "@id": "${HTTPS}${URL}/#website",
                        "url": "${HTTPS}${URL}",
                        "name": "${NAME}",
                        "publisher": { "@id": "${HTTPS}${URL}/#person" }
                    },
                    {
                        "@type": "Person",
                        "@id": "${HTTPS}${URL}/#person",
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
                        "jobTitle": "${OCCUPATION}",
                        "worksFor": {
                            "@type": "Organization",
                            "name": "${ORGANIZATION}"
                        },
                        "alumniOf": [
                            {
                                "@type": "CollegeOrUniversity",
                                "name": "University of Sydney"
                            },
                            {
                                "@type": "CollegeOrUniversity",
                                "name": "University of Auckland"
                            }
                        ]
                    }
                ]
            }
        `}
      </script>
    </>
  );
};

export default MetaTags;
