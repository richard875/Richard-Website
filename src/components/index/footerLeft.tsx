import * as React from "react";
import gsap from "gsap";
import { Link } from "gatsby";
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

  return (
    <Container ref={acknowledgementRef}>
      <div
        className="mr-3"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        From Australia with Love
      </div>
      <VerticalSeparator></VerticalSeparator>
      <Link to={Route.Acknowledgement} state={globalCoords}>
        <div
          className="ml-3"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          Acknowledgement of Country
        </div>
      </Link>
    </Container>
  );
};

export default FooterLeft;

const Container = styled.div`
  display: flex;
  align-items: center;
  padding-left: 98px;
`;

const VerticalSeparator = styled.div`
  width: 0px;
  height: 17px;
  border: 1px solid ${COLOR.BLACK};
`;
