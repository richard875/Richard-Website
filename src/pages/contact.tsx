import React from "react";
import type { HeadFC } from "gatsby";
import { GatsbyLinkProps } from "gatsby";
import { motion } from "framer-motion";
import { URL, PAGE_TITLE, MODE, STANDALONE } from "../constants/meta";
import Route from "../routes/route";
import home from "../routes/home";
import intro from "../routes/intro";
import experience from "../routes/experience";
import projects from "../routes/projects";
import education from "../routes/education";
import styled from "styled-components";
import { StaticImage } from "gatsby-plugin-image";
import size from "../styles/layout";
import { COLOR } from "../styles/theme";
import MetaTags from "../components/seo/metaTags";
import LoadableCursorSsr from "../components/cursor/loadableCursorSsr";
import InitialTransition from "../components/transition/InitialTransition";
import CallToAction from "../components/global/callToAction";
import MousePosition from "../types/mousePosition";
import { EMAIL, LINKEDIN_URL, GITHUB_URL, COPYRIGHT } from "../constants/meta";
import { BLOCK_PADDING, BLOCK_PADDING_DESKTOP } from "../constants/margin";
import MetaImage from "../../static/images/meta/metaImage.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLinkedin, faGithub } from "@fortawesome/free-brands-svg-icons";
import getResume from "../helper/getResume";

const TITLE = "Contact Me";
const CURRENT_PAGE_TITLE = `${TITLE}${PAGE_TITLE}`;
const ARROW = "../../static/images/indexCircle/arrow.svg";
const CIRCLE = "../../static/images/indexCircle/circle.png";

const Contact = ({
  location,
}: {
  location: GatsbyLinkProps<MousePosition>;
}) => {
  const [hover, setHover] = React.useState(false);
  const [isIphoneX, setIsIphoneX] = React.useState(false);
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [transitionColor, setTransitionColor] = React.useState(
    COLOR.BACKGROUND_WHITE
  );

  // Detect if the page is opened as a PWA
  const params = new URLSearchParams((location as any).search);
  const isPwa = params.get(MODE) === STANDALONE;

  // Detect if the page is opened on an iPhone X or newer
  React.useEffect(() => {
    let iPhone =
      /iPhone/.test(navigator.userAgent) && !(window as any).MSStream;
    let aspect = window.screen.width / window.screen.height;
    setIsIphoneX(iPhone && aspect.toFixed(3) === "0.462");
  }, []);

  React.useEffect(() => {
    document.body.style.backgroundColor = COLOR.BACKGROUND_BLACK;
    const mediaQueryList = window.matchMedia("(prefers-color-scheme: dark)");
    const updateIsDarkMode = () => setIsDarkMode(mediaQueryList.matches);

    mediaQueryList.addEventListener("change", updateIsDarkMode);
    updateIsDarkMode();

    return () => mediaQueryList.removeEventListener("change", updateIsDarkMode);
  }, []);

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
          {TITLE}&nbsp;&nbsp;&nbsp;&nbsp;
        </Title>
        <CallToAction
          name="Home"
          setHover={setHover}
          isDarkMode={true}
          navigator={home}
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
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onClick={(e) => getResume(e)}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.4,
                delay: 0.3,
                ease: [0, 0.71, 0.2, 1.01],
              }}
            >
              <Circle>
                <StaticImage
                  className="relative h-5/6 w-5/6"
                  src={CIRCLE}
                  alt="Resume Circle"
                  placeholder="none"
                />
              </Circle>
              <StaticImage
                className="!relative md:!absolute !w-[60px] md:!w-[72px] lg:!w-[80px] !left-[55px] !bottom-[98px] md:!left-[64px] md:!bottom-[84.5px] lg:!left-[85px] lg:!bottom-[108px]"
                src={ARROW}
                alt="Resume Circle"
                placeholder="none"
              />
            </motion.div>
          </CircleContainer>
        </Left>
        <Right isIphoneXPwa={isIphoneX && isPwa}>
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
                icon={faLinkedin as any}
                size={"2x"}
                className="mr-5"
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                onClick={(e) => {
                  e.preventDefault();
                  window.open(LINKEDIN_URL, "_blank");
                }}
              />
              <FontAwesomeIcon
                icon={faGithub as any}
                size={"2x"}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                onClick={(e) => {
                  e.preventDefault();
                  window.open(GITHUB_URL, "_blank");
                }}
              />
            </div>
            <p className="mb-2 text-lg">{URL}</p>
            <p>
              <span
                className="mt-0.5 hover:text-gray-400 transition-all"
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                onClick={(e) => {
                  setTransitionColor(COLOR.BACKGROUND_WHITE);
                  home(e);
                }}
              >
                Home
              </span>
            </p>
            <p>
              <span
                className="mt-0.5 hover:text-gray-400 transition-all"
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                onClick={(e) => {
                  setTransitionColor(COLOR.BACKGROUND_BLACK);
                  intro(e);
                }}
              >
                Intro
              </span>
            </p>
            <p>
              <span
                className="mt-0.5 hover:text-gray-400 transition-all"
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                onClick={(e) => {
                  setTransitionColor(
                    isDarkMode
                      ? COLOR.BACKGROUND_BLACK
                      : COLOR.BACKGROUND_WHITE_SECONDARY
                  );
                  experience(e, isDarkMode);
                }}
              >
                Experience
              </span>
            </p>
            <p>
              <span
                className="mt-0.5 hover:text-gray-400 transition-all"
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                onClick={(e) => {
                  setTransitionColor(
                    isDarkMode
                      ? COLOR.BACKGROUND_BLACK
                      : COLOR.BACKGROUND_WHITE_SECONDARY
                  );
                  projects(e, isDarkMode);
                }}
              >
                Projects
              </span>
            </p>
            <p>
              <span
                className="mt-0.5 hover:text-gray-400 transition-all"
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                onClick={(e) => {
                  setTransitionColor(
                    isDarkMode
                      ? COLOR.BACKGROUND_BLACK
                      : COLOR.BACKGROUND_WHITE_SECONDARY
                  );
                  education(e, isDarkMode);
                }}
              >
                Education
              </span>
            </p>
          </motion.div>
        </Right>
      </Box>
      <LoadableCursorSsr
        hover={hover}
        delay={0.5}
        position={location.state!}
        isBlack={false}
        fallback={<></>}
      />
    </Container>
  );
};

export default Contact;

export const Head: HeadFC = () => (
  <>
    <title>{CURRENT_PAGE_TITLE}</title>
    <meta name="theme-color" content={COLOR.BACKGROUND_BLACK} />
    <MetaTags
      path={Route.Contact}
      MetaImage={MetaImage}
      name={CURRENT_PAGE_TITLE}
    />
  </>
);

const Container = styled(motion.div)`
  width: 100vw;
  color: ${COLOR.WHITE};
  background-color: ${COLOR.BACKGROUND_BLACK};
  cursor: none;

  @media ${size.down.md} {
    @media screen and (max-height: 100vh) {
      padding-bottom: 20px;
    }
  }
`;

const Top = styled.div`
  display: flex;
  align-items: center;
  padding-top: 5px;
  padding-bottom: 3px;
  margin-left: ${BLOCK_PADDING + "px"};
  margin-right: ${BLOCK_PADDING + "px"};
  border-bottom: 0.5px solid ${COLOR.BACKGROUND_WHITE_SECONDARY};
  background-color: ${COLOR.BACKGROUND_BLACK};

  @media ${size.down.md} {
    width: calc(100% - 2 * ${BLOCK_PADDING + "px"});
    position: fixed;
    justify-content: space-between;
  }

  @media ${size.up.md} {
    margin-left: ${BLOCK_PADDING_DESKTOP + "px"};
    margin-right: ${BLOCK_PADDING_DESKTOP + "px"};
  }
`;

const Title = styled.p`
  font-size: 20px;
  user-select: none;

  @media ${size.up.md} {
    font-size: 25px;
  }
`;

const Box = styled.div`
  padding-top: 59px;
  padding-left: 20px;
  padding-right: 20px;

  @media ${size.down.md} {
    display: flex;
    flex-direction: column;
    @media screen and (min-height: 100vh) {
      height: 100vh;
    }
  }

  @media ${size.up.md} {
    display: flex;
    height: calc(100vh - 46.5px);
    padding-top: 6vw;
    padding-bottom: 30px;
    padding-left: 50px;
    padding-right: 50px;
  }

  @media ${size.up.xl} {
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

const Right = styled.div`
  flex: 0.35;
  display: flex;
  flex-direction: column-reverse;

  @media ${size.up.md} {
    align-items: center;
  }

  @media ${size.down.md} {
    flex: 1;
    align-items: flex-start;
    padding-bottom: ${({ isIphoneXPwa }: { isIphoneXPwa: boolean }) =>
      isIphoneXPwa ? "30px" : "20px"};
  }
`;

const ContactText = styled.p`
  font-size: 12.5vw;
  line-height: 15vw;

  @media ${size.up.md} {
    font-size: 7.5vw;
    line-height: 9vw;
  }
`;

const ContactEmail = styled.p`
  font-size: 19px;

  @media ${size.up.sm} {
    font-size: 24px;
  }

  @media ${size.up.lg} {
    font-size: 26px;
  }

  @media ${size.up.xl} {
    font-size: 28px;
  }

  @media ${size.up.xxxl} {
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
  background: ${COLOR.BRIGHT_GREEN};
  border: 2px solid ${COLOR.BLACK};
  animation: rotation 12s infinite linear;

  @keyframes rotation {
    100% {
      transform: rotate(-360deg);
    }
  }

  @media ${size.up.md} {
    width: 200px;
    height: 200px;
  }

  @media ${size.up.lg} {
    width: 250px;
    height: 250px;
  }
`;

const CircleContainer = styled.div`
  width: 170px;
  height: 170px;
  border-radius: 99px;
  transition: 0.5s all cubic-bezier(0.045, 0.32, 0.265, 1);
  user-select: none;

  &:hover {
    transform: rotate(-170deg) scale(1.07);
  }

  @media ${size.down.md} {
    margin-top: 30px;
  }

  @media ${size.up.md} {
    position: absolute;
    width: 200px;
    height: 200px;
    bottom: 45vh;
    right: 15vw;
  }

  @media ${size.up.lg} {
    width: 250px;
    height: 250px;
    bottom: 50vh;
    right: 15vw;
  }
`;
