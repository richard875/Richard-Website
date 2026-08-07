import { css } from "styled-components";
import layout from "../styles/layout";
import { FontSizeAdjust } from "../types/workExperience";

// Single source of truth for the description text's base font-size/
// line-height, below the `xxxl` breakpoint and from `xxxl` up. Consumed by
// both DescriptionText (global/textSection.tsx) and the fontSizeAdjust
// overrides below, so the two can never silently drift out of sync.
export const DESCRIPTION_FONT_SIZE = 18;
export const DESCRIPTION_LINE_HEIGHT = 25;
export const DESCRIPTION_FONT_SIZE_XXXL = 20;
export const DESCRIPTION_LINE_HEIGHT_XXXL = 30;

const BREAKPOINTS: {
  key: keyof FontSizeAdjust;
  media: string;
  baseFontSize: number;
  baseLineHeight: number;
}[] = [
  {
    key: "md",
    media: layout.up.md,
    baseFontSize: DESCRIPTION_FONT_SIZE,
    baseLineHeight: DESCRIPTION_LINE_HEIGHT,
  },
  {
    key: "lg",
    media: layout.up.lg,
    baseFontSize: DESCRIPTION_FONT_SIZE,
    baseLineHeight: DESCRIPTION_LINE_HEIGHT,
  },
  {
    key: "xl",
    media: layout.up.xl,
    baseFontSize: DESCRIPTION_FONT_SIZE,
    baseLineHeight: DESCRIPTION_LINE_HEIGHT,
  },
  {
    key: "xxl",
    media: layout.up.xxl,
    baseFontSize: DESCRIPTION_FONT_SIZE,
    baseLineHeight: DESCRIPTION_LINE_HEIGHT,
  },
  {
    key: "xxxl",
    media: layout.up.xxxl,
    baseFontSize: DESCRIPTION_FONT_SIZE_XXXL,
    baseLineHeight: DESCRIPTION_LINE_HEIGHT_XXXL,
  },
];

// Must be applied to the block element that owns the base font-size/
// line-height (e.g. the DescriptionText <p>), not an inline child — a
// smaller line-height set on an inline element can't shrink a line box
// below the height established by its block container's own line-height.
const fontSizeAdjustStyles = (fontSizeAdjust?: FontSizeAdjust) => {
  if (!fontSizeAdjust) return "";
  return css`
    ${BREAKPOINTS.map(({ key, media, baseFontSize, baseLineHeight }) => {
      const delta = fontSizeAdjust[key];
      if (delta === undefined) return "";
      return css`
        @media ${media} {
          font-size: ${baseFontSize + delta}px;
          line-height: ${baseLineHeight + delta}px;
        }
      `;
    })}
  `;
};

export default fontSizeAdjustStyles;
