import * as React from "react";
import { GatsbyLinkProps, Link } from "gatsby";
import styled from "styled-components";
import Route from "../routes/route";
import { COLOR } from "../styles/theme";
import Cursor from "../components/cursor/cursor";
import mousePositionType from "../types/mousePositionType";

const Acknowledgement = ({
  location,
}: {
  location: GatsbyLinkProps<mousePositionType>;
}) => {
  const [hover, setHover] = React.useState(false);
  const [globalCoords, setGlobalCoords] = React.useState({
    x: 0,
    y: 0,
  } as mousePositionType);

  React.useEffect(() => {
    const handleWindowMouseMove = (event: MouseEvent) =>
      setGlobalCoords({ x: event.clientX, y: event.clientY });

    window.addEventListener("mousemove", handleWindowMouseMove);

    return () => window.removeEventListener("mousemove", handleWindowMouseMove);
  }, []);

  return (
    <Container className="select-none">
      <Cursor hover={hover} position={location.state!} isBlack={false} />
      <AcknowledgementText>
        We acknowledge the Traditional Owners of the land where we work and
        live. We pay our respects to Elders past, present and emerging. We
        celebrate the stories, culture and traditions of Aboriginal and Torres
        Strait Islander Elders of all communities who also work and live on this
        land.
      </AcknowledgementText>

      <Link to={Route.Home} state={globalCoords}>
        <BackButton
          className="font-bold"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
        >
          Back
        </BackButton>
      </Link>
    </Container>
  );
};

export default Acknowledgement;

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  padding: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: ${COLOR.WHITE};
  background-color: ${COLOR.BLACK}; ;
`;

const AcknowledgementText = styled.div`
  font-size: 30px;
  line-height: 60px;
  text-align: justify;
`;

const BackButton = styled.div`
  font-size: 20px;
  margin-top: 70px;
  text-decoration-line: underline;
  text-underline-offset: 4px;
`;
