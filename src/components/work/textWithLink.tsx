import * as React from "react";
import styled from "styled-components";
import { up } from "styled-breakpoints";
import { COLOR } from "../../styles/theme";
import {
  MEDIA_TOP_OFFSET,
  MEDIA_TOP_OFFSET_DESKTOP,
  MEDIA_MARGIN_LEFT,
  MEDIA_MARGIN_LEFT_DESKTOP,
} from "../../constants/workPage";

const TextWithLink = ({
  isFirst,
  content, // In type JobDescription
  isLink, // In type JobDescription
  url, // In type JobDescription
  setHover,
}: {
  isFirst: boolean;
  content: string;
  isLink?: boolean;
  url?: string;
  setHover: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const clickableRef = React.useRef<HTMLAnchorElement>(null);
  const [displayMedia, setDisplayMedia] = React.useState(false);

  return (
    <>
      {isFirst ? "• " : " "}
      {isLink ? (
            <Media ref={mediaRef} position={clickableRef}></Media>

        <a
            ref={clickableRef}
          className="underline cursor-none"
          style={{ color: COLOR.RED }}
          href={url}
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
        </a>
        </>
      ) : (
        content
      )}
    </>
  );
};

export default TextWithLink;

const Media = styled.div`
  position: absolute;
  width: calc(100vw - 2 * 10px);
  height: calc((100vw - 2 * 10px) * 0.583333333);
  background-color: red;
  margin-top: -63vw;

  ${up("md")} {
    width: 360px;
    height: 210px;
    margin-top: 0;
    background-color: red;
    margin-left: ${MEDIA_MARGIN_LEFT + "px"};
    top: ${({ position }: { position: React.RefObject<HTMLAnchorElement> }) =>
      position?.current?.getBoundingClientRect().top! -
      MEDIA_TOP_OFFSET +
      "px"};
  }

  ${up("xxxl")} {
    width: 385px;
    height: 225px;
    margin-left: ${MEDIA_MARGIN_LEFT_DESKTOP + "px"};
    top: ${({ position }: { position: React.RefObject<HTMLAnchorElement> }) =>
      position?.current?.getBoundingClientRect().top! -
      MEDIA_TOP_OFFSET_DESKTOP +
      "px"};
  }
`;
