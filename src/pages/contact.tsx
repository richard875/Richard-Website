import * as React from "react";
import type { HeadFC } from "gatsby";
import { GatsbyLinkProps } from "gatsby";
import { motion } from "framer-motion";
import { URL, PAGE_TITLE } from "../constants/meta";
import Route from "../routes/route";
import home from "../routes/home";
import experience from "../routes/experience";
import work from "../routes/work";
import projects from "../routes/projects";
import education from "../routes/education";
import styled from "styled-components";
import { up, down, between } from "styled-breakpoints";
import { useBreakpoint } from "styled-breakpoints/react-styled";
import { StaticImage } from "gatsby-plugin-image";
import { isDesktop } from "react-device-detect";
import { COLOR } from "../styles/theme";
import MetaTags from "../components/seo/metaTags";
import Layout from "../components/global/layout";
import Cursor from "../components/cursor/cursor";
import InitialTransition from "../components/transition/InitialTransition";
import CallToAction from "../components/global/callToAction";
import MousePosition from "../types/mousePosition";
import convertToRoman from "../helper/convertToRoman";
import { EMAIL } from "../constants/meta";
import { BLOCK_PADDING, BLOCK_PADDING_DESKTOP } from "../constants/workPage";
import MetaImage from "../../static/images/meta/metaImage.jpg";

const TITLE = "Contact Me";
const CURRENT_PAGE_TITLE = `${TITLE}${PAGE_TITLE}`;
const ARROW = "../../static/images/indexCircle/arrow.svg";
const CIRCLE = "../../static/images/indexCircle/circle.png";

const Production = () => {
  return (
    <p className="mt-5 md:mt-0">
      {new Date().getFullYear()} A Richard Lee's production |{" "}
      {convertToRoman(new Date().getFullYear())}
    </p>
  );
};

const Contact = ({
  location,
}: {
  location: GatsbyLinkProps<MousePosition>;
}) => {
  const [hover, setHover] = React.useState(false);
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [transitionColor, setTransitionColor] = React.useState(
    COLOR.BACKGROUND_WHITE
  );

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
    <Layout>
      <Container
        className="font-secondary-normal"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          stiffness: 0,
          duration: 1,
          delay: 0.5,
        }}
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
            transition={{
              stiffness: 0,
              duration: 1,
              delay: 1,
            }}
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
            {useBreakpoint(up("md")) && <Production />}
            <CircleContainer
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
            >
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: 3,
                  delay: 1.3,
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
                {useBreakpoint(down("md")) && (
                  <StaticImage
                    width={60}
                    style={{
                      position: "relative",
                      left: 55,
                      bottom: 98,
                    }}
                    src={ARROW}
                    alt="Resume Circle"
                    placeholder="none"
                  />
                )}
                {useBreakpoint(between("md", "lg")) && (
                  <StaticImage
                    width={72}
                    style={{
                      position: "absolute",
                      left: 64,
                      bottom: 84.5,
                    }}
                    src={ARROW}
                    alt="Resume Circle"
                    placeholder="none"
                  />
                )}
                {useBreakpoint(up("lg")) && (
                  <StaticImage
                    width={80}
                    style={{
                      position: "absolute",
                      left: 85,
                      bottom: 108,
                    }}
                    src={ARROW}
                    alt="Resume Circle"
                    placeholder="none"
                  />
                )}
              </motion.div>
            </CircleContainer>
          </Left>
          <Right>
            {useBreakpoint(down("md")) && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{
                  stiffness: 0,
                  duration: 1,
                  delay: 1.9,
                }}
              >
                <Production />
              </motion.div>
            )}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{
                stiffness: 0,
                duration: 1,
                delay: 1.6,
              }}
            >
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
                    experience(e);
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
                    work(e, isDarkMode);
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

        {isDesktop && (
          <Cursor
            hover={hover}
            delay={1.5}
            position={location.state!}
            isBlack={false}
          />
        )}
      </Container>
    </Layout>
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

  ${down("md")} {
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

  ${down("md")} {
    width: calc(100% - 2 * ${BLOCK_PADDING + "px"});
    position: fixed;
    z-index: 9999;
    justify-content: space-between;
  }

  ${up("md")} {
    margin-left: ${BLOCK_PADDING_DESKTOP + "px"};
    margin-right: ${BLOCK_PADDING_DESKTOP + "px"};
  }
`;

const Title = styled.p`
  font-size: 20px;

  ${up("md")} {
    font-size: 25px;
  }
`;

const Box = styled.div`
  padding-top: 59px;
  padding-left: 20px;
  padding-right: 20px;

  ${down("md")} {
    @media screen and (min-height: 100vh) {
      height: 100vh;
    }
  }

  ${up("md")} {
    display: flex;
    height: calc(100vh - 46.5px);
    padding-top: 6vw;
    padding-bottom: 30px;
    padding-left: 50px;
    padding-right: 50px;
  }

  ${up("xl")} {
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

  ${up("md")} {
    align-items: center;
  }
`;

const ContactText = styled.p`
  font-size: 12.5vw;
  line-height: 15vw;

  ${up("md")} {
    font-size: 7.5vw;
    line-height: 9vw;
  }
`;

const ContactEmail = styled.p`
  font-size: 19px;

  ${up("sm")} {
    font-size: 24px;
  }

  ${up("lg")} {
    font-size: 26px;
  }

  ${up("xl")} {
    font-size: 28px;
  }

  ${up("xxxl")} {
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

  ${up("md")} {
    width: 200px;
    height: 200px;
  }

  ${up("lg")} {
    width: 250px;
    height: 250px;
  }
`;

const CircleContainer = styled.span`
  transition: 0.5s all cubic-bezier(0.045, 0.32, 0.265, 1);
  user-select: none;

  ${down("md")} {
    margin-top: 25px;
  }

  ${up("md")} {
    position: absolute;
    bottom: 45vh;
    right: 15vw;

    &:hover {
      transform: rotate(-360deg) scale(1.07);
    }
  }

  ${up("xxl")} {
    bottom: 50vh;
    right: 15vw;
  }
`;
