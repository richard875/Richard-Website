import * as React from "react";
import { COLOR } from "../../styles/theme";

const TextWithLink = ({
  isFirst,
  content, // In type JobDescription
}: {
  isFirst: boolean;
  content: string;
}) => {
  return (
    <>
      {isFirst ? "• " : " "}
      {content}
    </>
  );
};

export default TextWithLink;
