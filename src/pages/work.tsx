import * as React from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { GatsbyLinkProps, navigate } from "gatsby";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleChevronRight } from "@fortawesome/free-solid-svg-icons";
import Route from "../routes/route";
import { NAME } from "../../static/data/meta";
import { up } from "styled-breakpoints";
import { isDesktop } from "react-device-detect";
import type { HeadFC } from "gatsby";
import { COLOR } from "../styles/theme";
import Layout from "../components/global/layout";
import Cursor from "../components/cursor/cursor";
import InitialTransition from "../components/transition/InitialTransition";
import MousePosition from "../types/mousePosition";
import iconPicker from "../helper/iconPicker";
import workData from "../../static/data/work.json";
import WorkExperience, { JobDescription } from "../types/workExperience";

gsap.registerPlugin(ScrollTrigger);
const BLOCK_PADDING = 25;
const BLOCK_WIDTH =
  typeof window !== `undefined` && window.innerWidth <= 1600 ? 500 : 580;
const IMAGE_DEFAULT_HEIGHT = 50;

const CallToAction = ({
  setHover,
}: {
  setHover: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <Cta
      className="font-secondary-normal"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div className="pr-1.5 hover:pr-3 transition-all ease-in-out underline underline-offset-2">
        Projects
      </div>
      <FontAwesomeIcon
        icon={faCircleChevronRight}
        size={"sm"}
        className="mt-1"
      />
    </Cta>
  );
};

const TextWithLink = ({
  isFirst,
  content,
  isLink,
  url,
  setHover,
}: {
  isFirst: boolean;
  content: string;
  isLink?: boolean;
  url?: string;
  setHover: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <>
      {isFirst ? "• " : " "}
      {isLink ? (
        <a
          className="underline cursor-none"
          style={{ color: COLOR.RED }}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          {content}
        </a>
      ) : (
        content
      )}
    </>
  );
};

const Work = ({ location }: { location: GatsbyLinkProps<MousePosition> }) => {
  const [hover, setHover] = React.useState(false);
  const component = React.useRef<HTMLDivElement>(null);
  const slider = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    document.body.style.backgroundColor = COLOR.BACKGROUND_WHITE_SECONDARY;
  }, []);

  React.useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      gsap.to(slider.current, {
        xPercent: -100,
        left: "100%",
        ease: "none",
        scrollTrigger: {
          trigger: slider.current,
          pin: true,
          scrub: 1,
          end: () => "+=" + slider.current!.offsetWidth,
        },
      });
    }, component);
    return () => ctx.revert();
  }, []);

  return (
    <Layout>
      <Container
        ref={component}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          stiffness: 0,
          duration: 1,
          delay: 0.5,
        }}
      >
        <InitialTransition color={COLOR.BACKGROUND_WHITE_SECONDARY} />
        <Horizontal ref={slider} entryLength={workData.length}>
          {workData.map((experience: WorkExperience, index: number) => {
            return (
              <Block
                className="font-primary-normal panel"
                key={index}
                isLast={index == workData.length - 1}
              >
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    stiffness: 0,
                    duration: 1,
                    delay: 0.4 + 0.3 * (index + 2),
                  }}
                >
                  <Logo
                    height={experience.imageHeight}
                    src={iconPicker(experience.company, false)}
                    alt={experience.companyTitle}
                  />
                  <JobTitle>{experience.jobTitle}</JobTitle>
                  <Company>{experience.companyTitle}</Company>
                  <Secondary className="mt-6 xxxl:mt-9">
                    {experience.start.desktop} — {experience.end.desktop}
                  </Secondary>
                  <Secondary>
                    {experience.city}, {experience.country}
                  </Secondary>
                  {experience.description.map(
                    (description: JobDescription[], index: number) => {
                      return (
                        <JobDescriptionText key={index} isFirst={index == 0}>
                          {description.map(
                            (sentence: JobDescription, index: number) => (
                              <TextWithLink
                                key={index}
                                isFirst={index == 0}
                                setHover={setHover}
                                {...sentence}
                              />
                            )
                          )}
                        </JobDescriptionText>
                      );
                    }
                  )}
                  <JobDescriptionText isFirst={false}>
                    - <span style={{ color: COLOR.RED }}>Tech stack</span>:
                    {experience.techStack.map(
                      (tech: string, index: number) =>
                        `${index == 0 ? " " : " • "}${tech}`
                    )}
                  </JobDescriptionText>
                </motion.div>
              </Block>
            );
          })}
        </Horizontal>
        <Top>
          <Title className="font-secondary-normal">
            Work Experience&nbsp;&nbsp;&nbsp;&nbsp;
          </Title>
          <CallToAction setHover={setHover} />
        </Top>

        {isDesktop && (
          <Cursor
            hover={hover}
            delay={1.5}
            position={location.state!}
            isBlack={true}
          />
        )}
      </Container>
    </Layout>
  );
};

export default Work;

export const Head: HeadFC = () => <title>Work Experience | {NAME}</title>;

const Container = styled(motion.div)`
  cursor: none;
  overflow-x: hidden;
`;

const Top = styled.div`
  position: fixed;
  top: 0;
  margin-left: ${BLOCK_PADDING + "px"};
  width: calc(100% - 50px);
  display: flex;
  align-items: center;
  padding-top: 5px;
  padding-bottom: 3px;
  border-bottom: 0.5px solid ${COLOR.BACKGROUND_BLACK_SECONDARY};
`;

const Title = styled.p`
  font-size: 25px;
`;

const Horizontal = styled.div`
  width: ${({ entryLength }: { entryLength: number }) =>
    `${entryLength * BLOCK_WIDTH}px`};
  height: 100vh;
  display: flex;
  flex-wrap: wrap;
  padding-top: 66px;
  padding-bottom: 20px;
`;

const Block = styled.div`
  width: ${BLOCK_WIDTH + "px"};
  padding-left: ${BLOCK_PADDING + "px"};
  padding-right: ${BLOCK_PADDING + "px"};
  border-right: ${({ isLast }: { isLast: boolean }) =>
    !isLast && `0.5px solid ${COLOR.BACKGROUND_BLACK_SECONDARY}`};
`;

const Logo = styled.img`
  height: ${({ height }: { height: number }) => height + "px"};
  width: auto;
  margin-top: ${({ height }: { height: number }) =>
    10 - (height - IMAGE_DEFAULT_HEIGHT) / 2 + "px"};
  margin-bottom: ${({ height }: { height: number }) =>
    30 - (height - IMAGE_DEFAULT_HEIGHT) / 2 + "px"};
`;

const JobTitle = styled.p`
  font-size: 22px;
  color: ${COLOR.RED};

  ${up("xxxl")} {
    font-size: 24px;
  }
`;

const Company = styled.p`
  font-size: 22px;

  ${up("xxxl")} {
    font-size: 24px;
  }
`;

const Secondary = styled.p`
  font-size: 16px;

  ${up("xxxl")} {
    font-size: 18px;
  }
`;

const JobDescriptionText = styled.p`
  margin-top: ${({ isFirst }: { isFirst: boolean }) =>
    isFirst ? "25px" : "20px"};
  width: ${BLOCK_WIDTH - 2 * BLOCK_PADDING + "px"};
  font-size: 18px;
  line-height: 25px;

  ${up("xxxl")} {
    margin-top: ${({ isFirst }: { isFirst: boolean }) =>
      isFirst ? "40px" : "20px"};
    font-size: 20px;
    line-height: 30px;
  }
`;

const Cta = styled.div`
  display: flex;
  align-items: center;
  color: ${COLOR.DIM_GREEN};
  font-size: 20px;
  margin-bottom: 1px;
`;
