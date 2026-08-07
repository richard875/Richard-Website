import React from "react";
import styled from "styled-components";
import Color from "../../enums/color";
import layout from "../../styles/layout";
import { EXPERIENCE_MEDIA, PROJECTS_MEDIA } from "../../constants/googleTags";
import {
  BLOCK_WIDTH,
  BLOCK_WIDTH_DESKTOP,
  BLOCK_PADDING_DESKTOP,
} from "../../constants/margin";
import fontSizeAdjustStyles, {
  DESCRIPTION_FONT_SIZE,
  DESCRIPTION_LINE_HEIGHT,
  DESCRIPTION_FONT_SIZE_XXXL,
  DESCRIPTION_LINE_HEIGHT_XXXL,
} from "../../helper/fontSizeAdjustStyles";
import { FontSizeAdjust } from "../../types/workExperience";

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
  clickableRef: React.RefObject<HTMLAnchorElement | null>;
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

// Shared by work/block.tsx and projects/block.tsx to wrap each paragraph of
// TextSection sentences (as well as the tech-stack summary line). The two
// pages only differ in how much margin-top the first paragraph gets at the
// `xxxl` breakpoint, hence $firstMarginTopXxxl.
export const DescriptionText = styled.p<{
  $isFirst: boolean;
  $firstMarginTopXxxl: number;
  $fontSizeAdjust?: FontSizeAdjust;
}>`
  font-size: ${DESCRIPTION_FONT_SIZE}px;
  line-height: ${DESCRIPTION_LINE_HEIGHT}px;
  margin-top: ${({ $isFirst }) => ($isFirst ? "25px" : "20px")};

  @media ${layout.up.md} {
    width: ${BLOCK_WIDTH - 2 * BLOCK_PADDING_DESKTOP + "px"};
  }

  @media ${layout.up.xxxl} {
    font-size: ${DESCRIPTION_FONT_SIZE_XXXL}px;
    line-height: ${DESCRIPTION_LINE_HEIGHT_XXXL}px;
    margin-top: ${({ $isFirst, $firstMarginTopXxxl }) =>
      $isFirst ? `${$firstMarginTopXxxl}px` : "20px"};
    width: ${BLOCK_WIDTH_DESKTOP - 2 * BLOCK_PADDING_DESKTOP + "px"};
  }

  ${({ $fontSizeAdjust }) => fontSizeAdjustStyles($fontSizeAdjust)}
`;

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
