import React from "react";
import gsap from "gsap";
import styled from "styled-components";
import layout from "../../styles/layout";
import Route from "../../routes/route";
import routeTo from "../../routes/routeTo";
import gsapAnimationIndex from "../../helper/gsapAnimationIndex";
import { INDEX_TO_ACKNOWLEDGEMENT_DESKTOP } from "../../constants/googleTags";

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
    <Container
      ref={acknowledgementRef}
      id={`${INDEX_TO_ACKNOWLEDGEMENT_DESKTOP}_0`}
    >
      <h2
        id={`${INDEX_TO_ACKNOWLEDGEMENT_DESKTOP}_1`}
        className="font-secondary-normal select-none"
        onClick={(e) => routeTo(e, Route.Acknowledgement)}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        Acknowledgement of Country
      </h2>
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
