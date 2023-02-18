import * as React from "react";
import gsap from "gsap";
import styled from "styled-components";
import { up, down } from "styled-breakpoints";
import { COLOR } from "../../styles/theme";
import gsapAnimationIndex from "../../helper/gsapAnimationIndex";
import contact from "../../routes/contact";

const EMAIL = "hello@richard-lee.com";

const Top = ({
  setHover,
}: {
  setHover: (value: React.SetStateAction<boolean>) => void;
}) => {
  const emailRef = React.useRef(null);
  const projectRef = React.useRef(null);

  React.useEffect(() => {
    gsap.defaults({ ease: "power4.out", duration: 1.8 });
    gsap.from(emailRef.current, gsapAnimationIndex(150, 2, 20));
    gsap.from(projectRef.current, gsapAnimationIndex(150, 2, 20));
  }, []);

  return (
    <Container>
      <div
        ref={emailRef}
        className="font-secondary-normal overflow-hidden"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
      >
        <a
          className="cursor-none"
          href={`mailto:${EMAIL}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          {EMAIL}
        </a>
      </div>

      <div
        ref={projectRef}
        className="font-secondary-normal"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={(e) => contact(e)}
      >
        CONTACT
      </div>
    </Container>
  );
};

export default Top;

const Container = styled.div`
  height: 40px;
  font-size: 15px;
  padding-left: 15px;
  padding-right: 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;
  border-bottom: 3px solid ${COLOR.BLACK};

  ${up("sm")} {
    font-size: 17px;
  }

  ${up("lg")} {
    height: 60px;
    font-size: 25px;
    padding-left: 28px;
    padding-right: 28px;
  }

  ${up("xxl")} {
    height: 9vh;
    font-size: 30px;
  }
`;
