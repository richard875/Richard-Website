import * as React from "react";
import gsap from "gsap";
import styled from "styled-components";
import gsapAnimationIndex from "../../helper/gsapAnimationIndex";

const FooterRight = () => {
  const timeRef = React.useRef(null);

  React.useEffect(() => {
    gsap.defaults({ ease: "power4.out", duration: 1.8 });
    gsap.from(timeRef.current, gsapAnimationIndex(150, 3.4, 20));
  }, []);

  return (
    <Container ref={timeRef}>
      <Indicator></Indicator>
      <div>Sydney 9:41 am</div>
    </Container>
  );
};

export default FooterRight;

const Container = styled.div`
  display: flex;
  align-items: center;
  padding-right: 98px;
`;

const Indicator = styled.div`
  width: 8px;
  height: 8px;
  margin-right: 7px;
  border-radius: 99px;
  background: #35be27;
`;
