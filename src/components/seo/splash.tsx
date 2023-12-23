import React from "react";
// Splash images
import splash640x1136 from "../../../static/images/splash/apple-splash-640-1136.jpg";
import splash750x1334 from "../../../static/images/splash/apple-splash-750-1334.jpg";
import splash828x1792 from "../../../static/images/splash/apple-splash-828-1792.jpg";
import splash1125x2436 from "../../../static/images/splash/apple-splash-1125-2436.jpg";
import splash1136x640 from "../../../static/images/splash/apple-splash-1136-640.jpg";
import splash1170x2532 from "../../../static/images/splash/apple-splash-1170-2532.jpg";
import splash1179x2556 from "../../../static/images/splash/apple-splash-1179-2556.jpg";
import splash1242x2208 from "../../../static/images/splash/apple-splash-1242-2208.jpg";
import splash1242x2688 from "../../../static/images/splash/apple-splash-1242-2688.jpg";
import splash1284x2778 from "../../../static/images/splash/apple-splash-1284-2778.jpg";
import splash1290x2796 from "../../../static/images/splash/apple-splash-1290-2796.jpg";
import splash1334x750 from "../../../static/images/splash/apple-splash-1334-750.jpg";
import splash1536x2048 from "../../../static/images/splash/apple-splash-1536-2048.jpg";
import splash1620x2160 from "../../../static/images/splash/apple-splash-1620-2160.jpg";
import splash1668x2224 from "../../../static/images/splash/apple-splash-1668-2224.jpg";
import splash1668x2388 from "../../../static/images/splash/apple-splash-1668-2388.jpg";
import splash1792x828 from "../../../static/images/splash/apple-splash-1792-828.jpg";
import splash2048x1536 from "../../../static/images/splash/apple-splash-2048-1536.jpg";
import splash2048x2732 from "../../../static/images/splash/apple-splash-2048-2732.jpg";
import splash2160x1620 from "../../../static/images/splash/apple-splash-2160-1620.jpg";
import splash2208x1242 from "../../../static/images/splash/apple-splash-2208-1242.jpg";
import splash2224x1668 from "../../../static/images/splash/apple-splash-2224-1668.jpg";
import splash2388x1668 from "../../../static/images/splash/apple-splash-2388-1668.jpg";
import splash2436x1125 from "../../../static/images/splash/apple-splash-2436-1125.jpg";
import splash2532x1170 from "../../../static/images/splash/apple-splash-2532-1170.jpg";
import splash2556x1179 from "../../../static/images/splash/apple-splash-2556-1179.jpg";
import splash2688x1242 from "../../../static/images/splash/apple-splash-2688-1242.jpg";
import splash2732x2048 from "../../../static/images/splash/apple-splash-2732-2048.jpg";
import splash2778x1284 from "../../../static/images/splash/apple-splash-2778-1284.jpg";
import splash2796x1290 from "../../../static/images/splash/apple-splash-2796-1290.jpg";

const Splash = ({ children }: { children: any }) => (
  <>
    {children}
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <link
      rel="apple-touch-startup-image"
      href={splash2048x2732}
      media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
    />
    <link
      rel="apple-touch-startup-image"
      href={splash2732x2048}
      media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
    />
    <link
      rel="apple-touch-startup-image"
      href={splash1668x2388}
      media="(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
    />
    <link
      rel="apple-touch-startup-image"
      href={splash2388x1668}
      media="(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
    />
    <link
      rel="apple-touch-startup-image"
      href={splash1536x2048}
      media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
    />
    <link
      rel="apple-touch-startup-image"
      href={splash2048x1536}
      media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
    />
    <link
      rel="apple-touch-startup-image"
      href={splash1668x2224}
      media="(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
    />
    <link
      rel="apple-touch-startup-image"
      href={splash2224x1668}
      media="(device-width: 834px) and (device-height: 1112px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
    />
    <link
      rel="apple-touch-startup-image"
      href={splash1620x2160}
      media="(device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
    />
    <link
      rel="apple-touch-startup-image"
      href={splash2160x1620}
      media="(device-width: 810px) and (device-height: 1080px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
    />
    <link
      rel="apple-touch-startup-image"
      href={splash1290x2796}
      media="(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
    />
    <link
      rel="apple-touch-startup-image"
      href={splash2796x1290}
      media="(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
    />
    <link
      rel="apple-touch-startup-image"
      href={splash1179x2556}
      media="(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
    />
    <link
      rel="apple-touch-startup-image"
      href={splash2556x1179}
      media="(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
    />
    <link
      rel="apple-touch-startup-image"
      href={splash1284x2778}
      media="(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
    />
    <link
      rel="apple-touch-startup-image"
      href={splash2778x1284}
      media="(device-width: 428px) and (device-height: 926px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
    />
    <link
      rel="apple-touch-startup-image"
      href={splash1170x2532}
      media="(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
    />
    <link
      rel="apple-touch-startup-image"
      href={splash2532x1170}
      media="(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
    />
    <link
      rel="apple-touch-startup-image"
      href={splash1125x2436}
      media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
    />
    <link
      rel="apple-touch-startup-image"
      href={splash2436x1125}
      media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
    />
    <link
      rel="apple-touch-startup-image"
      href={splash1242x2688}
      media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
    />
    <link
      rel="apple-touch-startup-image"
      href={splash2688x1242}
      media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
    />
    <link
      rel="apple-touch-startup-image"
      href={splash828x1792}
      media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
    />
    <link
      rel="apple-touch-startup-image"
      href={splash1792x828}
      media="(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
    />
    <link
      rel="apple-touch-startup-image"
      href={splash1242x2208}
      media="(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)"
    />
    <link
      rel="apple-touch-startup-image"
      href={splash2208x1242}
      media="(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)"
    />
    <link
      rel="apple-touch-startup-image"
      href={splash750x1334}
      media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
    />
    <link
      rel="apple-touch-startup-image"
      href={splash1334x750}
      media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
    />
    <link
      rel="apple-touch-startup-image"
      href={splash640x1136}
      media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)"
    />
    <link
      rel="apple-touch-startup-image"
      href={splash1136x640}
      media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)"
    />
  </>
);

export default Splash;
