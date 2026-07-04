import React from "react";
import { HeadFC } from "gatsby";
import styled from "styled-components";
import { motion } from "framer-motion";
import { WindowLocation } from "@reach/router";
import Color from "../enums/color";
import Route from "../routes/route";
import MousePosition from "../types/mousePosition";
import { SITE_TITLE } from "../constants/meta";
import useLenisScroll from "../hooks/useLenisScroll";
import Splash from "../components/seo/splash";
import Preload from "../components/seo/preload";
import Cursor from "../components/cursor/cursor";
import MetaTags from "../components/seo/metaTags";
import InitialTransition from "../components/transition/InitialTransition";
import Grain from "../components/home/grain";
import Header from "../components/home/header";
import Hero from "../components/home/hero";
import Marquee from "../components/home/marquee";
import Statement from "../components/home/statement";
import Plate from "../components/home/plate";
import WorkIndex from "../components/home/workIndex";
import ExperienceIndex from "../components/home/experienceIndex";
import Colophon from "../components/home/colophon";
import MetaImage from "../../static/images/meta/metaImage.jpg";

// The Sydney Editorial — a single scroll narrative. See DESIGN.md.
const IndexPage = ({ location }: { location: WindowLocation }) => {
  const lenisRef = useLenisScroll();
  const [hover, setHover] = React.useState(false);

  React.useEffect(() => {
    document.body.style.backgroundColor = Color.BACKGROUND_WHITE;
    document.body.style.overflow = "auto";

    const themeTag = document.querySelector('meta[name="theme-color"]');
    if (themeTag) themeTag.setAttribute("content", Color.BACKGROUND_WHITE);
  }, []);

  return (
    <Main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <InitialTransition color={Color.BACKGROUND_BLACK} />
      <Grain />
      <Header lenisRef={lenisRef} setHover={setHover} />
      <Hero />
      <Marquee />
      <Statement setHover={setHover} />
      <Plate setHover={setHover} />
      <WorkIndex setHover={setHover} />
      <ExperienceIndex setHover={setHover} />
      <Colophon lenisRef={lenisRef} setHover={setHover} />
      <Cursor
        hover={hover}
        delay={0.8}
        isBlack={true}
        isIndexPage={true}
        blend={true}
        position={location.state! as MousePosition}
      />
    </Main>
  );
};

export default IndexPage;

export const Head: HeadFC = () => (
  <Splash>
    <title>{SITE_TITLE}</title>
    <meta name="theme-color" content={Color.BACKGROUND_WHITE} />
    <Preload />
    <MetaTags path={Route.Home} MetaImage={MetaImage} name={SITE_TITLE} />
  </Splash>
);

const Main = styled(motion.main)`
  background: var(--paper);
  cursor: none;

  a,
  button {
    cursor: none;
  }
`;
