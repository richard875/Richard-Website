import React from "react";
import canary from "../../../static/videos/canary.mp4";
import maily from "../../../static/videos/maily.mp4";
import neetcode from "../../../static/videos/neetcode.mp4";
import piston from "../../../static/videos/piston.mp4";
import smh from "../../../static/videos/smh.mp4";

// Hover-preview videos only play on these pages (desktop), so they are
// only preloaded there — every other page loads fonts alone.
const VIDEOS: Record<string, string[]> = {
  experience: [smh, canary],
  projects: [maily, neetcode, piston],
};

const Preload = ({ videos }: { videos?: "experience" | "projects" }) => (
  <>
    {/* Preload Fonts */}
    {/* These hrefs must match the @font-face src urls in typography.scss
        exactly (plain /fonts/... static paths, not webpack asset imports) —
        otherwise the browser preloads one URL and @font-face requests a
        different one, fetching each font twice. */}
    <link
      rel="preload"
      href="/fonts/sans-serif-flf-demibold.woff"
      as="font"
      type="font/woff"
      crossOrigin="anonymous"
    />
    <link
      rel="preload"
      href="/fonts/sans-serif-flf-bold.woff"
      as="font"
      type="font/woff"
      crossOrigin="anonymous"
    />
    <link
      rel="preload"
      href="/fonts/bw-gradual-medium.ttf"
      as="font"
      type="font/ttf"
      crossOrigin="anonymous"
    />

    {/* Preload Content */}
    {!!videos &&
      VIDEOS[videos].map((video) => (
        <link
          key={video}
          rel="preload"
          href={video}
          as="video"
          type="video/mp4"
        />
      ))}
  </>
);

export default Preload;
