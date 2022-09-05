import * as React from "react";
import styled from "styled-components";
import type { HeadFC } from "gatsby";
import { StaticImage } from "gatsby-plugin-image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { COLOR } from "../styles/theme";
import Cursor from "../components/cursor/cursor";

const IndexPage = () => {
  const [hover, setHover] = React.useState(false);

  return (
    <Container>
      <Cursor hover={hover} />
      <Wrapper>
        <Top>
          <div
            className="font-normal"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            hello@richard-lee.com
          </div>
          <div
            className="font-bold"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            PROJECTS
          </div>
        </Top>
        <Bottom>
          <Name>RICHARD LEE</Name>
          <Subtitle className="font-bold mt-9">
            SOFTWARE&nbsp;ENGINEER&nbsp;&amp;&nbsp;DESIGNER
          </Subtitle>
          <Subtitle className="font-bold mt-5">UNIVERSITY OF SYDNEY</Subtitle>
          <Button className="select-none">
            <div
              className="pr-2 hover:pr-3 transition-all ease-in-out underline underline-offset-4"
              onMouseEnter={() => setHover(true)}
              onMouseLeave={() => setHover(false)}
            >
              Let's catch up
            </div>
            <FontAwesomeIcon
              icon={faAngleRight}
              size={"xs"}
              className="mt-0.5"
            />
          </Button>
          <span
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            <Circle className="select-none">
              <StaticImage
                className="relative h-5/6 w-5/6"
                src="../images/circle.svg"
                alt="Resume Circle"
                placeholder="none"
              />
            </Circle>
            <StaticImage
              width={60}
              style={Arrow}
              src="../images/arrow.svg"
              alt="Resume Circle"
              placeholder="none"
            />
          </span>
        </Bottom>
      </Wrapper>
      <Footer>
        <FLeft>
          <div
            className="mr-3"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            From Australia with Love
          </div>
          <VerticalSeparator></VerticalSeparator>
          <div
            className="ml-3"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            Acknowledgement of Country
          </div>
        </FLeft>
        <FRight>
          <Indicator></Indicator>
          <div>Sydney 9:41 am</div>
        </FRight>
      </Footer>
    </Container>
  );
};

export default IndexPage;

export const Head: HeadFC = () => (
  <title>Richard Lee | Software Engineer | University of Sydney</title>
);

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Wrapper = styled.div`
  margin-top: 70px;
  display: flex;
  flex-direction: column;
  width: calc(100vw - 140px);
  height: calc(100vh - 140px);
  border: 3px solid ${COLOR.BLACK};
`;

const Footer = styled.div`
  width: 100%;
  height: 70px;
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const FLeft = styled.div`
  display: flex;
  align-items: center;
  padding-left: 98px;
`;

const FRight = styled.div`
  display: flex;
  align-items: center;
  padding-right: 98px;
`;

const VerticalSeparator = styled.div`
  width: 0px;
  height: 17px;
  border: 1px solid ${COLOR.BLACK};
`;

const Indicator = styled.div`
  width: 8px;
  height: 8px;
  margin-right: 7px;
  border-radius: 99px;
  background: #35be27;
`;

const Top = styled.div`
  height: 80px;
  padding-left: 28px;
  padding-right: 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 30px;
  border-bottom: 3px solid ${COLOR.BLACK};
`;

const Bottom = styled.div`
  flex: 1;
  padding: 95px 55px;
  background: linear-gradient(90deg, #f55591 0%, #f9c41a 100%);
`;

const Name = styled.div`
  font-size: 100px;
  line-height: 120px;
  color: ${COLOR.WHITE};
  -webkit-text-stroke: 2px ${COLOR.BLACK};
`;

const Subtitle = styled.div`
  font-size: 30px;
  line-height: 36px;
  color: ${COLOR.WHITE};
`;

const Button = styled.div`
  display: flex;
  align-items: center;
  margin-top: 50px;
  font-size: 23px;
  color: ${COLOR.WHITE};
  cursor: pointer;
`;

const Circle = styled.div`
  width: 170px;
  height: 170px;
  position: absolute;
  bottom: 150px;
  right: 150px;
  border-radius: 99px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #cdff50;
  border: 2px solid ${COLOR.BLACK};
  animation: rotation 12s infinite linear;

  @keyframes rotation {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(359deg);
    }
  }
`;

const Arrow = {
  position: "absolute",
  bottom: 222,
  right: 205,
} as React.CSSProperties;
