import * as React from "react";
import gsap from "gsap";
import styled from "styled-components";
import { COLOR } from "../../styles/theme";
import mousePositionType from "../../types/mousePositionType";
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
    gsap.defaults({ ease: "power4.out", duration: 1.8 });
    gsap.from(acknowledgementRef.current, gsapAnimationIndex(150, 3.4, 20));
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
  display: flex;
  align-items: center;
  margin-left: 15px;
`;

const VerticalSeparator = styled.div`
  width: 0px;
  height: 17px;
  border: 1px solid ${COLOR.BLACK};
`;
