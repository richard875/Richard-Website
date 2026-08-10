// Cloudflare Pages determines trailing-slash behaviour from the physical
// build output (dir/index.html vs flat .html), not from Gatsby's own
// `trailingSlash` config — see gatsby-config.ts's `trailingSlash: "always"`.
// These values must carry the trailing slash so every consumer (routeTo,
// metaTags canonical/OG/JSON-LD URLs, siteUrlList) matches what Cloudflare
// actually serves without a redirect. NotFound is exempt: Gatsby emits a
// dedicated flat /404.html for host 404 handling, and it isn't a page we
// want indexed/canonicalised.
enum Route {
  Home = "/",
  Acknowledgement = "/acknowledgement/",
  Intro = "/intro/",
  Experience = "/experience/",
  Projects = "/projects/",
  Education = "/education/",
  Contact = "/contact/",
  NotFound = "/404",
}

export default Route;
