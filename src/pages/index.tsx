import * as React from "react";
import styled from "styled-components";
import type { HeadFC } from "gatsby";
import { COLOR } from "../styles/theme";

const IndexPage = () => {
  return (
    <Container>
      <Wrapper>
        <Top>
          <div className="font-normal">hello@richard-lee.com</div>
          <div className="font-bold">PROJECTS</div>
        </Top>
        <Bottom>
          <Name>RICHARD LEE</Name>
          <Subtitle className="font-bold mt-9">
            SOFTWARE&nbsp;ENGINEER&nbsp;&amp;&nbsp;DESIGNER
          </Subtitle>
          <Subtitle className="font-bold mt-5">UNIVERSITY OF SYDNEY</Subtitle>
          <Button>Let's catch up</Button>
        </Bottom>
      </Wrapper>
      <Footer>
        <FLeft>
          <div className="mr-3">From Australia with Love</div>
          <VerticalSeparator></VerticalSeparator>
          <div className="ml-3">Acknowledgement of Country</div>
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
  width: 220px;
  height: 60px;
  margin-top: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 23px;
  color: ${COLOR.WHITE};
  /* background-color: ${COLOR.BLACK}; */
  border: 3px solid ${COLOR.WHITE};
  cursor: pointer;
`;
