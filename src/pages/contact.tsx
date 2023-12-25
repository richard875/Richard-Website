import React from "react";
import { HeadFC } from "gatsby";
import styled from "styled-components";
import { motion } from "framer-motion";
import { WindowLocation } from "@reach/router";
import { StaticImage } from "gatsby-plugin-image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedin, faGithub } from "@fortawesome/free-brands-svg-icons";
import Route from "../routes/route";
import routeTo from "../routes/routeTo";
import Color from "../enums/color";
import layout from "../styles/layout";
import Splash from "../components/seo/splash";
import Preload from "../components/seo/preload";
import Cursor from "../components/cursor/cursor";
import MetaTags from "../components/seo/metaTags";
import CallToAction from "../components/global/callToAction";
import InitialTransition from "../components/transition/InitialTransition";
import getResume from "../helper/getResume";
import MousePosition from "../types/mousePosition";
import usePwaDetection from "../hooks/usePwaDetection";
import useDarkModeManager from "../hooks/useDarkModeManager";
import useIphoneXDetection from "../hooks/useIphoneXDetection";
import { RESUME_CONTACT } from "../constants/googleTags";
import { URL, PAGE_TITLE, CONTACT_TITLE } from "../constants/meta";
import { BLOCK_PADDING, BLOCK_PADDING_DESKTOP } from "../constants/margin";
import { EMAIL, LINKEDIN_URL, GITHUB_URL, COPYRIGHT } from "../constants/meta";
import MetaImage from "../../static/images/meta/metaImage.jpg";

const CURRENT_PAGE_TITLE = `${CONTACT_TITLE}${PAGE_TITLE}`;
const ARROW = "../../static/images/indexCircle/arrow.svg";
const CIRCLE = "../../static/images/indexCircle/circle.png";

const Contact = ({ location }: { location: WindowLocation }) => {
  const isPwa = usePwaDetection(location);
  const isIphoneX = useIphoneXDetection();
  const isDarkMode = useDarkModeManager(true, Color.BACKGROUND_BLACK);
  const [hover, setHover] = React.useState(false);
  const [transitionColor, setTransitionColor] = React.useState(
    Color.BACKGROUND_WHITE
  );

  React.useEffect(() => {
    const overflow = window.matchMedia("(min-height: 100vh)").matches
      ? "hidden"
      : "auto";
    document.body.style.overflow = overflow;

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  return (
    <Container
      className="font-secondary-normal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ stiffness: 0, duration: 0.4 }}
    >
      <InitialTransition color={transitionColor} />
      <Top>
        <Title className="font-secondary-normal">
          {CONTACT_TITLE}&nbsp;&nbsp;&nbsp;&nbsp;
        </Title>
        <CallToAction
          name="Home"
          forward={true}
          setHover={setHover}
          route={Route.Home}
        />
      </Top>
      <Box>
        <Left
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ stiffness: 0, duration: 0.4, delay: 0.2 }}
        >
          <div>
            <ContactText>Get in touch with me!</ContactText>
            <ContactEmail className="pt-3 md:pt-12">
              Email me at:&nbsp;
              <span
                className="underline decoration-dotted hover:text-gray-400 transition-all"
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
              >
                <a
                  href={`mailto:${EMAIL}`}
                  target="_blank"
                  className="cursor-none"
                  rel="noopener noreferrer"
                >
                  {EMAIL}
                </a>
              </span>
            </ContactEmail>
          </div>
          <p className="hidden md:block mt-5 md:mt-0">{COPYRIGHT}</p>
          <CircleContainer
            id={`${RESUME_CONTACT}_0`}
            onClick={(e) => getResume(e)}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            <motion.div
              id={`${RESUME_CONTACT}_1`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.4,
                delay: 0.3,
                ease: [0, 0.71, 0.2, 1.01],
              }}
            >
              <Circle id={`${RESUME_CONTACT}_2`}>
                <StaticImage
                  id={`${RESUME_CONTACT}_3`}
                  alt="Resume Circle"
                  src={CIRCLE}
                  className="relative h-5/6 w-5/6"
                  placeholder="none"
                />
              </Circle>
              <StaticImage
                id={`${RESUME_CONTACT}_4`}
                alt="Resume Circle"
                src={ARROW}
                className="!relative md:!absolute !w-[60px] md:!w-[72px] lg:!w-[80px] !left-[55px] !bottom-[98px] md:!left-[64px] md:!bottom-[84.5px] lg:!left-[85px] lg:!bottom-[108px]"
                placeholder="none"
              />
            </motion.div>
          </CircleContainer>
        </Left>
        <Right $isIphoneXPwa={isIphoneX && isPwa}>
          <motion.div
            className="md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ stiffness: 0, duration: 0.4, delay: 0.4 }}
          >
            <p className="mt-5 md:mt-0">{COPYRIGHT}</p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ stiffness: 0, duration: 0.4, delay: 0.5 }}
          >
            <div className="flex mb-4">
              <FontAwesomeIcon
                size={"2x"}
                icon={faLinkedin}
                className="mr-5"
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                onClick={(e) => {
                  e.preventDefault();
                  window.open(LINKEDIN_URL, "_blank");
                }}
              />
              <FontAwesomeIcon
                size={"2x"}
                icon={faGithub}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                onClick={(e) => {
                  e.preventDefault();
                  window.open(GITHUB_URL, "_blank");
                }}
              />
            </div>
            <h2 className="mb-2 text-lg">{URL}</h2>
            <h2>
              <span
                className="mt-0.5 hover:text-gray-400 transition-all"
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                onClick={(e) => routeTo(e, Route.Home)}
              >
                Home
              </span>
            </h2>
            <h2>
              <span
                className="mt-0.5 hover:text-gray-400 transition-all"
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                onClick={(e) => {
                  setTransitionColor(Color.BACKGROUND_BLACK);
                  routeTo(e, Route.Intro);
                }}
              >
                Intro
              </span>
            </h2>
            <h2>
              <span
                className="mt-0.5 hover:text-gray-400 transition-all"
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                onClick={(e) => {
                  setTransitionColor(
                    isDarkMode
                      ? Color.BACKGROUND_BLACK
                      : Color.BACKGROUND_WHITE_SECONDARY
                  );
                  routeTo(e, Route.Experience, isDarkMode);
                }}
              >
                Experience
              </span>
            </h2>
            <h2>
              <span
                className="mt-0.5 hover:text-gray-400 transition-all"
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                onClick={(e) => {
                  setTransitionColor(
                    isDarkMode
                      ? Color.BACKGROUND_BLACK
                      : Color.BACKGROUND_WHITE_SECONDARY
                  );
                  routeTo(e, Route.Projects, isDarkMode);
                }}
              >
                Projects
              </span>
            </h2>
            <h2>
              <span
                className="mt-0.5 hover:text-gray-400 transition-all"
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                onClick={(e) => {
                  setTransitionColor(
                    isDarkMode
                      ? Color.BACKGROUND_BLACK
                      : Color.BACKGROUND_WHITE_SECONDARY
                  );
                  routeTo(e, Route.Education, isDarkMode);
                }}
              >
                Education
              </span>
            </h2>
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

  @media ${layout.down.md} {
    @media screen and (max-height: 100vh) {
      padding-bottom: 20px;
    }
  }
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

  @media ${layout.down.md} {
    width: calc(100% - 2 * ${BLOCK_PADDING + "px"});
    position: fixed;
  }

  @media ${layout.up.md} {
    margin-left: ${BLOCK_PADDING_DESKTOP + "px"};
    margin-right: ${BLOCK_PADDING_DESKTOP + "px"};
  }
`;

const Title = styled.h1`
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
    display: flex;
    flex-direction: column;
    @media screen and (min-height: 100vh) {
      height: 100vh;
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
  flex: 0.65;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const Right = styled.div<{ $isIphoneXPwa: boolean }>`
  flex: 0.35;
  display: flex;
  flex-direction: column-reverse;

  @media ${layout.up.md} {
    align-items: center;
  }

  @media ${layout.down.md} {
    flex: 1;
    align-items: flex-start;
    margin-top: 30px;
    padding-bottom: ${({ $isIphoneXPwa }) => ($isIphoneXPwa ? "30px" : "20px")};
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

const Circle = styled.div`
  width: 170px;
  height: 170px;
  border-radius: 199px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid ${Color.BLACK};
  background: ${Color.BRIGHT_GREEN};
  animation: rotation 12s infinite linear;

  @keyframes rotation {
    100% {
      transform: rotate(-360deg);
    }
  }

  @media ${layout.up.md} {
    width: 200px;
    height: 200px;
  }

  @media ${layout.up.lg} {
    width: 250px;
    height: 250px;
  }
`;

const CircleContainer = styled.div`
  width: 170px;
  height: 170px;
  user-select: none;
  border-radius: 99px;
  transition: 0.5s all cubic-bezier(0.045, 0.32, 0.265, 1);

  &:hover {
    transform: rotate(-170deg) scale(1.07);
  }

  @media ${layout.down.md} {
    margin-top: 30px;
  }

  @media ${layout.up.md} {
    position: absolute;
    width: 200px;
    height: 200px;
    bottom: 45vh;
    right: 15vw;
  }

  @media ${layout.up.lg} {
    width: 250px;
    height: 250px;
    bottom: 50vh;
    right: 15vw;
  }
`;
