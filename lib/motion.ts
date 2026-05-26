import type { Variants } from "framer-motion";

// Signature easing curves (mirrors tailwind.config + design-tokens.md)
export const easeExpoOut = [0.16, 1, 0.3, 1] as const;
export const easeStandard = [0.4, 0, 0.2, 1] as const;

// Section / element reveal on scroll-into-view
export const reveal: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: easeExpoOut },
  },
};

// Parent that staggers its children into view
export const staggerParent: Variants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

// Child item used inside a staggerParent
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeExpoOut },
  },
};

// Shared viewport config: animate once, a little before fully in view
export const inViewOnce = { once: true, margin: "0px 0px -10% 0px" } as const;
