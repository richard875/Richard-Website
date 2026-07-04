import React from "react";

// The signature mark — a four-point star, a nod to the Southern Cross.
// Used as list bullet, marquee separator and section ornament.
const Star = ({
  size = 22,
  color = "currentColor",
  className,
}: {
  size?: number | string;
  color?: string;
  className?: string;
}) => (
  <svg
    viewBox="0 0 100 100"
    width={size}
    height={size}
    className={className}
    aria-hidden="true"
    focusable="false"
  >
    <path
      d="M50 0C54.5 32.5 67.5 45.5 100 50C67.5 54.5 54.5 67.5 50 100C45.5 67.5 32.5 54.5 0 50C32.5 45.5 45.5 32.5 50 0Z"
      fill={color}
    />
  </svg>
);

export default Star;
