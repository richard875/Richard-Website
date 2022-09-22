import * as React from "react";
import gsap from "gsap";
import { navigate } from "gatsby";
import styled from "styled-components";
import Route from "../../routes/route";
import { COLOR } from "../../styles/theme";
import mousePositionType from "../../types/mousePositionType";
import gsapAnimationIndex from "../../helper/gsapAnimationIndex";

const FooterLeft = ({
  setHover,
  globalCoords,
}: {
  setHover: (value: React.SetStateAction<boolean>) => void;
  globalCoords: mousePositionType;
}) => {
  const acknowledgementRef = React.useRef(null);

  React.useEffect(() => {
    gsap.defaults({ ease: "power4.out", duration: 1.8 });
    gsap.from(acknowledgementRef.current, gsapAnimationIndex(150, 3.4, 20));
  }, []);

  const acknowledgement = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.preventDefault();
    document.body.style.backgroundColor = COLOR.BACKGROUND_BLACK;
    navigate(Route.Acknowledgement, { state: globalCoords });
  };

  return (
    <Container ref={acknowledgementRef}>
      <div
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
