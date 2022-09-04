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
        <Bottom></Bottom>
      </Wrapper>
      <Footer>
        <FLeft>From Australia with Love | Acknowledgement of Country</FLeft>
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
  padding-left: 98px;
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
  background: linear-gradient(90deg, #f55591 0%, #f9c41a 100%);
`;
