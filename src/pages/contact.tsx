import React from "react";
import { HeadFC } from "gatsby";
import styled from "styled-components";
import { motion } from "framer-motion";
import { WindowLocation } from "@reach/router";
import Color from "../enums/color";
import Route from "../routes/route";
import layout from "../styles/layout";
import Splash from "../components/seo/splash";
import Preload from "../components/seo/preload";
import Links from "../components/contact/links";
import Cursor from "../components/cursor/cursor";
import SplitText from "../components/motion/SplitText";
import HoverRoll from "../components/motion/HoverRoll";
import MetaTags from "../components/seo/metaTags";
import Landscape from "../components/global/landscape";
import ResumeCircle from "../components/global/resumeCircle";
import PillCallToAction from "../components/global/pillCallToAction";
import InitialTransition from "../components/transition/InitialTransition";
import MousePosition from "../types/mousePosition";
import usePwaDetection from "../hooks/usePwaDetection";
import useIphoneXDetection from "../hooks/useIphoneXDetection";
import useLandscapeDetection from "../hooks/useLandscapeDetection";
import { BLOCK_PADDING, BLOCK_PADDING_DESKTOP } from "../constants/margin";
import { CONTACT_EMAIL, CONTACT_TO_INDEX_TOP } from "../constants/googleTags";
import {
  PAGE_TITLE,
  CONTACT_TITLE,
  EMAIL,
  COPYRIGHT_LONG,
} from "../constants/meta";
import MetaImage from "../../static/images/meta/metaImage.jpg";

const CURRENT_PAGE_TITLE = `${CONTACT_TITLE}${PAGE_TITLE}`;

// The email's dotted underline fades in after the rest of the page's
// entrance choreography has settled (Left's fade, the SplitText char
// reveals, the Links/copyright fades all finish by ~1s) — kept as its own
// later beat rather than tied to the char reveal, see the email span below.
const UNDERLINE_DELAY = 1.2;

const Contact = ({ location }: { location: WindowLocation }) => {
  const isPwa = usePwaDetection(location);
  const isIphoneX = useIphoneXDetection();
  const isLandscape = useLandscapeDetection(isPwa);
  const [hover, setHover] = React.useState(false);
  const [transitionColor, setTransitionColor] = React.useState(
    Color.BACKGROUND_WHITE,
  );

  React.useEffect(() => {
    const heightMatcher = "(min-height: 100vh)";
    const ofl = window.matchMedia(heightMatcher).matches ? "hidden" : "auto";
    document.body.style.overflow = ofl;

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return isLandscape ? (
    <Landscape isPwa={isPwa} />
  ) : (
    <Container
      className="font-secondary-normal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ stiffness: 0, duration: 0.4 }}
    >
      <InitialTransition color={transitionColor} />
      <Top>
        <Title className="font-secondary-normal">{CONTACT_TITLE}</Title>
      </Top>
      <Box>
        <Left
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ stiffness: 0, duration: 0.4, delay: 0.2 }}
        >
          <div>
            <ContactText>
              <SplitText as="span" delay={0.3}>
                Get in touch with me!
              </SplitText>
            </ContactText>
            <ContactEmail className="pt-3 md:pt-10">
              <SplitText as="span" delay={0.45}>
                Email me at:
                <span className="hidden md:inline">&nbsp;</span>
                <br className="md:hidden" />
                <span
                  id={`${CONTACT_EMAIL}_0`}
                  className="relative hover:text-gray-400 transition-all"
                  onMouseEnter={() => setHover(true)}
                  onMouseLeave={() => setHover(false)}
                >
                  <a
                    id={`${CONTACT_EMAIL}_1`}
                    href={`mailto:${EMAIL}`}
                    target="_blank"
                    className="cursor-none"
                    rel="noopener noreferrer"
                  >
                    <HoverRoll stagger={0.008}>{EMAIL}</HoverRoll>
                  </a>
                  {/* A radial-gradient dot pattern, not border-dotted: a native dotted
                      border ties dot size to border-width, so it can't be both 2px
                      thick and sparsely dotted — the gradient decouples thickness
                      (height) from dot size/spacing (background-size). */}
                  <motion.span
                    className="absolute inset-x-0 -bottom-px h-2"
                    style={{
                      backgroundImage:
                        "radial-gradient(circle, currentColor 1.5px, transparent 1.5px)",
                      backgroundSize: "6px 8px",
                      backgroundRepeat: "repeat-x",
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      duration: 0.5,
                      ease: [0.22, 1, 0.36, 1],
                      delay: UNDERLINE_DELAY,
                    }}
                  />
                </span>
              </SplitText>
            </ContactEmail>
            <motion.div
              className="pt-6 md:pt-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ stiffness: 0, duration: 0.4, delay: 0.8 }}
            >
              <PillCallToAction
                name="Home"
                tagId={CONTACT_TO_INDEX_TOP}
                tagIdStartNum={0}
                forward={true}
                setHover={setHover}
                route={Route.Home}
              />
            </motion.div>
          </div>
          <motion.div
            className="hidden md:block"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ stiffness: 0, duration: 0.4, delay: 0.5 }}
          >
            <SplitText as="p" delay={0.8}>
              {COPYRIGHT_LONG}
            </SplitText>
          </motion.div>
          <div className="mt-8 md:hidden">
            <ResumeCircle isHome={false} setHover={setHover} />
          </div>
        </Left>
        <Right $isIphoneXPwa={isIphoneX && isPwa}>
          <div className="hidden md:block">
            <ResumeCircle isHome={false} setHover={setHover} />
          </div>
          <Links setHover={setHover} setTransitionColor={setTransitionColor} />
          <motion.div
            className="md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ stiffness: 0, duration: 0.4, delay: 0.5 }}
          >
            <p className="mt-5 md:mt-0">{COPYRIGHT_LONG}</p>
          </motion.div>
        </Right>
      </Box>
      <Cursor
        delay={0.5}
        hover={hover}
        isBlack={false}
        position={location.state! as MousePosition}
      />
    </Container>
  );
};

export default Contact;

export const Head: HeadFC = () => (
  <Splash>
    <title>{CURRENT_PAGE_TITLE}</title>
    <meta name="theme-color" content={Color.BACKGROUND_BLACK} />
    <Preload />
    <MetaTags
      path={Route.Contact}
      MetaImage={MetaImage}
      name={CURRENT_PAGE_TITLE}
    />
  </Splash>
);

const Container = styled(motion.div)`
  width: 100vw;
  color: ${Color.WHITE};
  background-color: ${Color.BACKGROUND_BLACK};
  cursor: none;
`;

const Top = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 5px;
  padding-bottom: 3px;
  margin-left: ${BLOCK_PADDING + "px"};
  margin-right: ${BLOCK_PADDING + "px"};
  background-color: ${Color.BACKGROUND_BLACK};
  border-bottom: 0.5px solid ${Color.BACKGROUND_WHITE_SECONDARY};
  z-index: 9999 !important;

  @media ${layout.down.md} {
    width: calc(100% - 2 * ${BLOCK_PADDING + "px"});
    position: fixed;
  }

  @media ${layout.up.md} {
    margin-left: ${BLOCK_PADDING_DESKTOP + "px"};
    margin-right: ${BLOCK_PADDING_DESKTOP + "px"};
  }
`;

const Title = styled.h2`
  font-size: 20px;
  user-select: none;

  @media ${layout.up.md} {
    font-size: 25px;
  }
`;

const Box = styled.div`
  padding-top: 59px;
  padding-left: 20px;
  padding-right: 20px;

  @media ${layout.down.md} {
    @media screen and (min-height: 100vh) {
      height: 100vh;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
  }

  @media ${layout.up.md} {
    display: flex;
    height: calc(100vh - 46.5px);
    padding-top: 6vw;
    padding-bottom: 30px;
    padding-left: 50px;
    padding-right: 50px;
  }

  @media ${layout.up.xl} {
    padding-left: 100px;
    padding-right: 100px;
  }
`;

const Left = styled(motion.div)`
  @media ${layout.up.md} {
    flex: 0.65;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
`;

const Right = styled.div<{ $isIphoneXPwa: boolean }>`
  padding-top: 30px;

  @media ${layout.up.md} {
    flex: 0.35;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
  }

  @media ${layout.down.md} {
    padding-bottom: ${({ $isIphoneXPwa }) => ($isIphoneXPwa ? "30px" : "10px")};
  }
`;

const ContactText = styled.h1`
  font-size: 12.5vw;
  line-height: 15vw;

  @media ${layout.up.md} {
    font-size: 7.5vw;
    line-height: 9vw;
  }
`;

const ContactEmail = styled.h2`
  font-size: 19px;

  @media ${layout.up.sm} {
    font-size: 24px;
  }

  @media ${layout.up.lg} {
    font-size: 26px;
  }

  @media ${layout.up.xl} {
    font-size: 28px;
  }

  @media ${layout.up.xxxl} {
    font-size: 30px;
  }
`;
