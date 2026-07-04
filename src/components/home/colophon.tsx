import React from "react";
import type Lenis from "lenis";
import styled from "styled-components";
import layout from "../../styles/layout";
import Route from "../../routes/route";
import routeTo from "../../routes/routeTo";
import getResume from "../../helper/getResume";
import useMaskReveal from "../../hooks/useMaskReveal";
import SectionLabel from "./sectionLabel";
import Star from "./star";
import {
  EMAIL,
  COPYRIGHT,
  GITHUB_URL,
  LINKEDIN_URL,
} from "../../constants/meta";
import {
  INDEX_EMAIL,
  INDEX_RESUME,
  CONTACT_GITHUB,
  CONTACT_LINKEDIN,
  INDEX_TO_ACKNOWLEDGEMENT_DESKTOP,
} from "../../constants/googleTags";

const getTimeInSydney = () =>
  new Date().toLocaleTimeString("en-AU", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Australia/Sydney",
  });

const Colophon = ({
  lenisRef,
  setHover,
}: {
  lenisRef: React.RefObject<Lenis | null>;
  setHover: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const headlineRef = React.useRef<HTMLParagraphElement>(null);
  const [time, setTime] = React.useState("00:00");

  useMaskReveal(headlineRef, { start: "top 80%", stagger: 0.11 });

  React.useEffect(() => {
    setTime(getTimeInSydney());
    const interval = setInterval(() => setTime(getTimeInSydney()), 1000);
    return () => clearInterval(interval);
  }, []);

  const hoverProps = {
    onMouseEnter: () => setHover(true),
    onMouseLeave: () => setHover(false),
  };

  const scrollToTop = () => {
    if (lenisRef.current) lenisRef.current.scrollTo(0);
    else window.scrollTo({ top: 0 });
  };

  return (
    <Section id="contact">
      <SectionLabel index="04" title="Contact" dark />
      <Headline
        ref={headlineRef}
        className="font-display line-mask"
        style={{ visibility: "hidden" }}
        aria-label="Say g'day"
      >
        Say <em className="font-accent">g&rsquo;day</em>.
      </Headline>
      <EmailLink
        id={`${INDEX_EMAIL}_0`}
        href={`mailto:${EMAIL}`}
        className="font-text"
        {...hoverProps}
      >
        {EMAIL}
      </EmailLink>
      <LinkRow>
        <FooterLink
          id={`${CONTACT_LINKEDIN}_0`}
          className="font-label"
          href={LINKEDIN_URL}
          target="_blank"
          rel="noopener noreferrer"
          {...hoverProps}
        >
          LinkedIn <span aria-hidden="true">↗</span>
        </FooterLink>
        <FooterLink
          id={`${CONTACT_GITHUB}_0`}
          className="font-label"
          href={GITHUB_URL}
          target="_blank"
          rel="noopener noreferrer"
          {...hoverProps}
        >
          GitHub <span aria-hidden="true">↗</span>
        </FooterLink>
        <FooterButton
          id={`${INDEX_RESUME}_0`}
          className="font-label"
          {...hoverProps}
          onClick={(e) => getResume(e)}
        >
          Résumé <span aria-hidden="true">↓</span>
        </FooterButton>
        <FooterButton
          className="font-label"
          {...hoverProps}
          onClick={(e) => routeTo(e, Route.Contact)}
        >
          Contact page <span aria-hidden="true">→</span>
        </FooterButton>
      </LinkRow>
      <Acknowledgement
        id={`${INDEX_TO_ACKNOWLEDGEMENT_DESKTOP}_0`}
        className="font-text"
        {...hoverProps}
        onClick={(e) => routeTo(e, Route.Acknowledgement)}
      >
        I acknowledge the Traditional Owners of the land where I work and
        live, and pay my respects to Elders past, present and emerging.
      </Acknowledgement>
      <BottomRow className="font-label">
        <span>{COPYRIGHT}</span>
        <Clock>
          <Star size={10} color="var(--gold)" />
          Sydney {time}
        </Clock>
        <Top className="font-label" {...hoverProps} onClick={scrollToTop}>
          Back to top <span aria-hidden="true">↑</span>
        </Top>
      </BottomRow>
    </Section>
  );
};

export default Colophon;

const Section = styled.footer`
  background: var(--ink);
  color: var(--paper);
  padding: clamp(70px, 12vh, 140px) var(--gutter) 26px;
`;

const Headline = styled.p`
  font-size: clamp(64px, 15vw, 280px);
  line-height: 0.94;
  margin-top: clamp(36px, 6vh, 80px);
  user-select: none;

  em {
    color: var(--gold);
    font-size: 0.98em;
    font-variation-settings: "wght" 340, "opsz" 144, "SOFT" 80, "WONK" 1;
  }
`;

const EmailLink = styled.a`
  display: inline-block;
  margin-top: clamp(30px, 5vh, 60px);
  font-size: clamp(22px, 3.2vw, 44px);
  color: var(--paper);
  text-decoration: none;
  border-bottom: 1px solid var(--hairline-paper);
  padding-bottom: 8px;
  cursor: none;
  transition: border-color 0.3s ease, color 0.3s ease;

  &:hover {
    color: var(--gold);
    border-color: var(--gold);
  }
`;

const LinkRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: clamp(22px, 3.5vw, 54px);
  margin-top: clamp(40px, 7vh, 80px);
`;

const linkStyles = `
  background: none;
  border: none;
  padding: 0;
  color: inherit;
  text-decoration: none;
  cursor: none;
  user-select: none;

  span {
    display: inline-block;
    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }

  &:hover span {
    transform: translate(3px, -2px);
  }
`;

const FooterLink = styled.a`
  ${linkStyles}
`;

const FooterButton = styled.button`
  ${linkStyles}
`;

const Acknowledgement = styled.p`
  margin-top: clamp(50px, 9vh, 110px);
  max-width: 52ch;
  font-size: 14px;
  line-height: 1.7;
  color: rgba(245, 237, 227, 0.55);
  cursor: none;
  transition: color 0.3s ease;

  &:hover {
    color: var(--paper);
  }
`;

const BottomRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 18px;
  margin-top: clamp(30px, 5vh, 60px);
  padding-top: 18px;
  border-top: 1px solid var(--hairline-paper);
  color: rgba(245, 237, 227, 0.65);

  @media ${layout.down.sm} {
    flex-wrap: wrap;
  }
`;

const Clock = styled.span`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Top = styled.button`
  background: none;
  border: none;
  padding: 0;
  color: inherit;
  cursor: none;
  user-select: none;

  span {
    display: inline-block;
    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }

  &:hover span {
    transform: translateY(-3px);
  }
`;
