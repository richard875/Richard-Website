import * as React from "react";
import { COLOR } from "../../styles/theme";

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
  return (
    <>
      {isFirst ? "• " : " "}
      {isLink ? (
        <a
          className="underline cursor-none"
          style={{ color: COLOR.RED }}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
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
