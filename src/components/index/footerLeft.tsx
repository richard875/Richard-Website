import * as React from "react";
import gsap from "gsap";
import styled from "styled-components";
import { up } from "styled-breakpoints";
import gsapAnimationIndex from "../../helper/gsapAnimationIndex";

const FooterLeft = ({
  setHover,
  acknowledgement,
}: {
  setHover: (value: React.SetStateAction<boolean>) => void;
  acknowledgement: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}) => {
  const acknowledgementRef = React.useRef(null);

  React.useEffect(() => {
    gsap.defaults({ ease: "power4.out" });
    gsap.from(
      acknowledgementRef.current,
      1.8,
      gsapAnimationIndex(150, 3.4, 20)
    );
  }, []);

  return (
    <Container ref={acknowledgementRef}>
      <div
        className="font-secondary-normal"
        onClick={(e) => acknowledgement(e)}
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

  ${up("xxl")} {
    font-size: 20px;
  }
`;
