import * as React from "react";
import styled from "styled-components";
import type { HeadFC } from "gatsby";
import { COLOR } from "../styles/theme";

const IndexPage = () => {
  return (
    <Container>
      <Wrapper>
        <Top>Richard</Top>
      </Wrapper>
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
  align-items: center;
  justify-content: center;
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: calc(100vw - 160px);
  height: calc(100vh - 160px);
  border: 3px solid ${COLOR.BLACK};
`;

const Top = styled.div`
  height: 80px;
  border-bottom: 3px solid ${COLOR.BLACK};
`;
