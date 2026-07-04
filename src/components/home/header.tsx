import React from "react";
import type Lenis from "lenis";
import styled from "styled-components";
import { motion } from "framer-motion";
import layout from "../../styles/layout";
import Route from "../../routes/route";
import routeTo from "../../routes/routeTo";
import Star from "./star";
import { INDEX_TO_INTRO, INDEX_TO_CONTACT } from "../../constants/googleTags";

const Header = ({
  lenisRef,
  setHover,
}: {
  lenisRef: React.RefObject<Lenis | null>;
  setHover: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const scrollTo = (target: string) => {
    if (lenisRef.current) lenisRef.current.scrollTo(target, { offset: -1 });
    else document.querySelector(target)?.scrollIntoView();
  };

  const hoverProps = {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
  };

  return (
    <Bar
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
    >
      <Ident className="font-label" {...hoverProps} onClick={() => scrollTo("body")}>
        <Star size={13} />
        <Name>
          Richard Everley
          <Folio> — Folio 2017→{new Date().getFullYear()}</Folio>
        </Name>
      </Ident>
      <Nav className="font-label">
        <button {...hoverProps} onClick={() => scrollTo("#work")}>
          Work
        </button>
        <button {...hoverProps} onClick={() => scrollTo("#experience")}>
          Experience
        </button>
        <button
          id={`${INDEX_TO_INTRO}_0`}
          {...hoverProps}
          onClick={(e) => routeTo(e, Route.Intro)}
        >
          About
        </button>
        <button
          id={`${INDEX_TO_CONTACT}_0`}
          {...hoverProps}
          onClick={(e) => routeTo(e, Route.Contact)}
        >
          Contact
        </button>
      </Nav>
    </Bar>
  );
};

export default Header;

const Bar = styled(motion.header)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 950;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px var(--gutter);
  /* paper + difference ⇒ ink on the paper sections, paper on the ink footer */
  color: var(--paper);
  mix-blend-mode: difference;
  pointer-events: none;

  & > * {
    pointer-events: auto;
  }
`;

const Ident = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: none;
  user-select: none;
  white-space: nowrap;

  span {
    padding-top: 1px;
  }

  svg {
    flex-shrink: 0;
  }
`;

const Folio = styled.span`
  @media ${layout.down.md} {
    display: none;
  }
`;

const Name = styled.span`
  @media ${layout.down.sm} {
    display: none;
  }
`;

const Nav = styled.nav`
  display: flex;
  gap: clamp(18px, 2.6vw, 40px);

  button {
    background: none;
    border: none;
    padding: 0;
    font: inherit;
    letter-spacing: inherit;
    text-transform: inherit;
    color: inherit;
    cursor: none;
    position: relative;

    &::after {
      content: "";
      position: absolute;
      left: 0;
      bottom: -4px;
      width: 100%;
      height: 1px;
      background: currentColor;
      transform: scaleX(0);
      transform-origin: right;
      transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1);
    }

    &:hover::after {
      transform: scaleX(1);
      transform-origin: left;
    }
  }

  @media ${layout.down.sm} {
    gap: 16px;

    button:first-child {
      display: none;
    }
  }
`;
