export function useMotion() {
  const fadeIn = (delay = 0) => ({
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, delay },
  });

  const slideIn = (direction: "left" | "right" = "left", delay = 0) => ({
    initial: { opacity: 0, x: direction === "left" ? -30 : 30 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.5, delay },
  });

  const scaleIn = (delay = 0) => ({
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.3, delay },
  });

  const stagger = (index: number, baseDelay = 0, staggerDelay = 0.1) => {
    return baseDelay + index * staggerDelay;
  };

  return {
    fadeIn,
    slideIn,
    scaleIn,
    stagger,
  };
}
