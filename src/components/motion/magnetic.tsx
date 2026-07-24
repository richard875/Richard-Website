import React from "react";
import gsap from "gsap";
import useIsDesktop from "../../hooks/useIsDesktop";
import usePrefersReducedMotion from "../../hooks/usePrefersReducedMotion";

/**
 * Interactive elements lean toward the cursor as it approaches and snap back
 * with a soft elastic release. Desktop-pointer only (skipped on touch and for
 * reduced-motion), and wraps children in a passthrough span so existing hover
 * handlers on the child keep working untouched.
 */
type MagneticProps = {
  children: React.ReactNode;
  /** 0–1: how far the element travels relative to cursor distance. */
  strength?: number;
  className?: string;
};

const Magnetic = ({ children, strength = 0.35, className }: MagneticProps) => {
  const ref = React.useRef<HTMLSpanElement>(null);
  const isDesktop = useIsDesktop();
  const prefersReduced = usePrefersReducedMotion();
  const enabled = isDesktop && !prefersReduced;

  const handleMove = (event: React.MouseEvent<HTMLSpanElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (event.clientX - (rect.left + rect.width / 2)) * strength;
    const y = (event.clientY - (rect.top + rect.height / 2)) * strength;
    gsap.to(el, { x, y, duration: 0.7, ease: "power3.out" });
  };

  const handleLeave = () => {
    if (ref.current) {
      gsap.to(ref.current, {
        x: 0,
        y: 0,
        duration: 1,
        ease: "elastic.out(1, 0.35)",
      });
    }
  };

  if (!enabled) return <>{children}</>;

  return (
    <span
      ref={ref}
      className={className}
      style={{ display: "inline-block", willChange: "transform" }}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      {children}
    </span>
  );
};

export default Magnetic;
