import React from "react";
import fontPrimaryNormal from "../../../static/fonts/SansSerifFLF-Demibold.woff";
import fontPrimaryBold from "../../../static/fonts/SansSerifBldFLF.woff";
import fontSecondaryNormal from "../../../static/fonts/BwGradual-Medium.ttf";
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
    <link
      rel="preload"
      href={fontPrimaryNormal}
      as="font"
      type="font/woff"
      crossOrigin="anonymous"
    />
    <link
      rel="preload"
      href={fontPrimaryBold}
      as="font"
      type="font/woff"
      crossOrigin="anonymous"
    />
    <link
      rel="preload"
      href={fontSecondaryNormal}
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
