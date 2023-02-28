import * as React from "react";
import fontPrimaryNormal from "../../../static/fonts/SansSerifFLF-Demibold.woff";
import fontPrimaryBold from "../../../static/fonts/SansSerifBldFLF.woff";
import fontSecondaryNormal from "../../../static/fonts/BwGradual-Medium.ttf";
import fontSecondaryBold from "../../../static/fonts/sf-pro-medium.otf";
import smh from "../../../static/videos/smh.mp4";
import cie from "../../../static/videos/cie.mp4";
import neetcode from "../../../static/videos/neetcode.mp4";
import piston from "../../../static/videos/piston.mp4";

const Preload = () => {
  return (
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
      <link
        rel="preload"
        href={fontSecondaryBold}
        as="font"
        type="font/otf"
        crossOrigin="anonymous"
      />

      {/* Preload Content */}
      <link rel="preload" href={neetcode} as="video" type="video/mp4" />
      <link rel="preload" href={piston} as="video" type="video/mp4" />
      <link rel="preload" href={smh} as="video" type="video/mp4" />
      <link rel="preload" href={cie} as="video" type="video/mp4" />
    </>
  );
};

export default Preload;