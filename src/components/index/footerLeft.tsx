import React from "react";
import gsap from "gsap";
import styled from "styled-components";
import layout from "../../styles/layout";
import Route from "../../routes/route";
import routeTo from "../../routes/routeTo";
import gsapAnimationIndex from "../../helper/gsapAnimationIndex";

const FooterLeft = ({
  setHover,
}: {
  setHover: (value: React.SetStateAction<boolean>) => void;
}) => {
  const acknowledgementRef = React.useRef(null);

  React.useEffect(() => {
    gsap.defaults({ ease: "power4.out" });
    gsap.from(acknowledgementRef.current, 1, gsapAnimationIndex(150, 1, 20));
  }, []);

  return (
    <Container ref={acknowledgementRef}>
      <div
        className="font-secondary-normal select-none"
        onClick={(e) => routeTo(e, Route.Acknowledgement, true)}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        Acknowledgement of Country
      </div>
    </Container>
  );
};

export default FooterLeft;

const Container = styled.div`
  font-size: 17px;
  display: flex;
  align-items: center;
  margin-left: 15px;

  @media ${layout.up.xxl} {
    font-size: 18px;
  }
`;
