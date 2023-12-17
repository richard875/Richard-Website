import React from "react";
import styled from "styled-components";
import layout from "../../styles/layout";
import { COLOR } from "../../styles/theme";

const TextSection = ({
  isFirst,
  content, // In type JobDescription
  textHighlight, // In type JobDescription
  url, // In type JobDescription
  clickableRef,
  setHover,
  setDisplayMedia,
  isDarkMode,
}: {
  isFirst: boolean;
  content: string;
  textHighlight?: boolean;
  url?: string;
  clickableRef: React.RefObject<HTMLAnchorElement>;
  setHover: React.Dispatch<React.SetStateAction<boolean>>;
  setDisplayMedia: React.Dispatch<React.SetStateAction<boolean>>;
  isDarkMode: boolean;
}) => {
  const renderSpace = (sentenceSlice: String) => {
    const firstChar = Array.from(sentenceSlice).at(0);
    if (firstChar === "," || firstChar === ".") return "";
    else return " ";
  };

  return (
    <>
      {isFirst ? "• " : renderSpace(content)}
      {!!url ? (
        <Link
          ref={clickableRef}
          href={url}
          $isDarkMode={isDarkMode}
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
      ) : textHighlight ? (
        <Highlight $isDarkMode={isDarkMode}>{content}</Highlight>
      ) : (
        content
      )}
    </>
  );
};

export default TextSection;

const Link = styled.a<{ $isDarkMode: boolean }>`
  cursor: none;
  text-decoration-line: underline;
  color: ${({ $isDarkMode }) => ($isDarkMode ? COLOR.BLUE : COLOR.RED)};

  @media ${layout.up.md} {
    color: ${({ $isDarkMode }) => ($isDarkMode ? COLOR.BLUE : COLOR.RED)};
    text-decoration-line: underline;
  }
`;

const Highlight = styled.span<{ $isDarkMode: boolean }>`
  margin: 0;
  padding: 0;
  color: ${({ $isDarkMode }) => ($isDarkMode ? COLOR.BLUE : COLOR.RED)};
`;
