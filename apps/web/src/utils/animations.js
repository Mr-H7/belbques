
/**
 * Animation configuration objects and timing functions
 */

export const transitionTimings = {
  fast: { duration: 0.2, ease: 'easeOut' },
  base: { duration: 0.3, ease: 'easeOut' },
  slow: { duration: 0.6, ease: 'easeInOut' },
};

export const scrollRevealVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (custom = 0) => ({
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.6,
      delay: custom * 0.1,
      ease: 'easeOut'
    }
  })
};

export const hoverScale = {
  scale: 1.02,
  transition: { duration: 0.2 }
};

export const tapScale = {
  scale: 0.98,
  transition: { duration: 0.1 }
};
