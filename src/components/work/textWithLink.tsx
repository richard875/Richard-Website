import * as React from "react";
import { COLOR } from "../../styles/theme";

const TextWithLink = ({
  isFirst,
  content, // In type JobDescription
  isLink, // In type JobDescription
  url, // In type JobDescription
  clickableRef,
  setHover,
  setDisplayMedia,
}: {
  isFirst: boolean;
  content: string;
  isLink?: boolean;
  url?: string;
  clickableRef: React.RefObject<HTMLAnchorElement>;
  setHover: React.Dispatch<React.SetStateAction<boolean>>;
  setDisplayMedia: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <>
      {isFirst ? "• " : " "}
      {isLink ? (
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
      ) : (
        content
      )}
    </>
  );
};

export default TextWithLink;
