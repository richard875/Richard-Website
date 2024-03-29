import React from "react";
import styled from "styled-components";
import Color from "../../enums/color";
import layout from "../../styles/layout";
import { EXPERIENCE_MEDIA, PROJECTS_MEDIA } from "../../constants/googleTags";

const TextSection = ({
  isFirst,
  isExperience,
  exproName,
  content, // In type JobDescription
  textHighlight, // In type JobDescription
  url, // In type JobDescription
  clickableRef,
  setHover,
  setDisplayMedia,
  isDarkMode,
}: {
  isFirst: boolean;
  isExperience: boolean;
  exproName: string;
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

  const mouseAction = (action: boolean) => {
    setHover(action);
    setDisplayMedia(action);
  };

  return (
    <>
      {isFirst ? "• " : renderSpace(content)}
      {!!url ? (
        <Link
          ref={clickableRef}
          id={`${
            isExperience ? EXPERIENCE_MEDIA : PROJECTS_MEDIA
          }_${exproName}_0`}
          href={url}
          $isDarkMode={isDarkMode}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => mouseAction(true)}
          onMouseLeave={() => mouseAction(false)}
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
  color: ${({ $isDarkMode }) => ($isDarkMode ? Color.BLUE : Color.RED)};

  @media ${layout.up.md} {
    text-decoration-line: underline;
    color: ${({ $isDarkMode }) => ($isDarkMode ? Color.BLUE : Color.RED)};
  }
`;

const Highlight = styled.span<{ $isDarkMode: boolean }>`
  margin: 0;
  padding: 0;
  color: ${({ $isDarkMode }) => ($isDarkMode ? Color.BLUE : Color.RED)};
`;
