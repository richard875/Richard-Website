import * as React from "react";
import styled from "styled-components";
import { up } from "styled-breakpoints";
import { COLOR } from "../../styles/theme";

const TextWithLink = ({
  isFirst,
  content, // In type JobDescription
  textUnderline, // In type JobDescription
  url, // In type JobDescription
  clickableRef,
  setHover,
  setDisplayMedia,
}: {
  isFirst: boolean;
  content: string;
  textUnderline?: boolean;
  url?: string;
  clickableRef: React.RefObject<HTMLAnchorElement>;
  setHover: React.Dispatch<React.SetStateAction<boolean>>;
  setDisplayMedia: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <>
      {isFirst ? "• " : " "}
      {textUnderline ? (
        <Link
          ref={clickableRef}
          href={url}
          hasLink={!!url}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => {
            setHover(true);
            setDisplayMedia(true);
          }}
          onMouseLeave={() => {
            setHover(false);
            setDisplayMedia(false);
          }}
        >
          {content}
        </Link>
      ) : (
        content
      )}
    </>
  );
};

export default TextWithLink;

const Link = styled.a`
  cursor: none;
  text-decoration-line: ${(props: { hasLink: boolean }) =>
    props.hasLink ? "underline" : undefined};
  color: ${(props: { hasLink: boolean }) =>
    props.hasLink ? COLOR.RED : undefined};

  ${up("md")} {
    color: ${COLOR.RED};
    text-decoration-line: underline;
  }
`;
