"use client";

/**
 * Cinematic motion layer for Lunara Glow.
 * Lenis smooth scroll + progress rail + scroll-driven reveals.
 * Respects prefers-reduced-motion.
 */

import {
  motion,
  useMotionTemplate,
  useScroll,
  useSpring,
  useTransform,
  type MotionProps,
} from "framer-motion";
import Lenis from "lenis";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

const ReduceCtx = createContext(false);

export function usePrefersReducedMotion() {
  return useContext(ReduceCtx);
}

export function LunaraMotionRoot({ children }: { children: ReactNode }) {
  const [reduce, setReduce] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduce(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  // Smooth scroll (Lenis) — off when reduced motion
  useEffect(() => {
    if (reduce) return;
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, [reduce]);

  return (
    <ReduceCtx.Provider value={reduce}>
      {!reduce ? <ScrollProgressRail /> : null}
      {children}
    </ReduceCtx.Provider>
  );
}

/** Thin progress line at top of viewport */
function ScrollProgressRail() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 28,
    restDelta: 0.001,
  });
  return (
    <motion.div
      className="lg-progress"
      style={{ scaleX }}
      aria-hidden
    />
  );
}

const easeOut = [0.22, 1, 0.36, 1] as const;

/** Fade/slide in when section enters view */
export function Reveal({
  children,
  className = "",
  delay = 0,
  y = 36,
  once = true,
  ...rest
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  once?: boolean;
} & MotionProps) {
  const reduce = usePrefersReducedMotion();
  if (reduce) {
    return <div className={className}>{children}</div>;
  }
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "-8% 0px -6% 0px", amount: 0.2 }}
      transition={{ duration: 0.85, delay, ease: easeOut }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

/** Stagger children on enter */
export function Stagger({
  children,
  className = "",
  stagger = 0.06,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
}) {
  const reduce = usePrefersReducedMotion();
  if (reduce) {
    return <div className={className}>{children}</div>;
  }
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-10% 0px" }}
      variants={{
        hidden: {},
        show: {
          transition: { staggerChildren: stagger, delayChildren: delay },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className = "",
  y = 28,
}: {
  children: ReactNode;
  className?: string;
  y?: number;
}) {
  const reduce = usePrefersReducedMotion();
  if (reduce) {
    return <div className={className}>{children}</div>;
  }
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.7, ease: easeOut },
        },
      }}
    >
      {children}
    </motion.div>
  );
}

/** Hero title: word-by-word lift */
export function HeroTitle({
  line1,
  line2,
}: {
  line1: string;
  line2: string;
}) {
  const reduce = usePrefersReducedMotion();
  const words1 = useMemo(() => line1.split(" "), [line1]);
  if (reduce) {
    return (
      <h1 className="lg-hero-title">
        {line1}
        <em>{line2}</em>
      </h1>
    );
  }
  return (
    <h1 className="lg-hero-title lg-hero-title--motion">
      <span className="lg-hero-line" aria-label={line1}>
        {words1.map((w, i) => (
          <motion.span
            key={`${w}-${i}`}
            className="lg-hero-word"
            initial={{ y: "110%", opacity: 0 }}
            animate={{ y: "0%", opacity: 1 }}
            transition={{
              duration: 0.95,
              delay: 0.15 + i * 0.08,
              ease: easeOut,
            }}
          >
            {w}
            {i < words1.length - 1 ? "\u00a0" : ""}
          </motion.span>
        ))}
      </span>
      <motion.em
        initial={{ y: 40, opacity: 0, clipPath: "inset(0 100% 0 0)" }}
        animate={{ y: 0, opacity: 1, clipPath: "inset(0 0% 0 0)" }}
        transition={{ duration: 1.1, delay: 0.45, ease: easeOut }}
      >
        {line2}
      </motion.em>
    </h1>
  );
}

/** Infinite editorial marquee of category names */
export function CategoryMarquee({ labels }: { labels: string[] }) {
  const reduce = usePrefersReducedMotion();
  const text = labels.join("  ·  ") + "  ·  ";
  if (reduce) {
    return (
      <div className="lg-marquee lg-marquee--static" aria-hidden>
        <span>{text}</span>
      </div>
    );
  }
  return (
    <div className="lg-marquee" aria-hidden>
      <div className="lg-marquee-track">
        <span>{text.repeat(4)}</span>
        <span>{text.repeat(4)}</span>
      </div>
    </div>
  );
}

/** Parallax slow drift on hero background layers */
export function HeroParallaxLayers() {
  const reduce = usePrefersReducedMotion();
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 600], [0, 120]);
  const y2 = useTransform(scrollY, [0, 600], [0, 70]);
  const opacity = useTransform(scrollY, [0, 420], [1, 0.25]);
  const blur = useTransform(scrollY, [0, 500], [0, 8]);
  const filter = useMotionTemplate`blur(${blur}px)`;

  if (reduce) {
    return (
      <div className="lg-hero-fx" aria-hidden>
        <div className="lg-hero-fx-grid" />
        <div className="lg-hero-fx-wash" />
        <div className="lg-hero-fx-grain" />
      </div>
    );
  }

  return (
    <motion.div className="lg-hero-fx" style={{ opacity }} aria-hidden>
      <motion.div className="lg-hero-fx-orb lg-hero-fx-orb-a" style={{ y: y1 }} />
      <motion.div className="lg-hero-fx-orb lg-hero-fx-orb-b" style={{ y: y2 }} />
      <div className="lg-hero-fx-grid" />
      <motion.div className="lg-hero-fx-wash" style={{ filter }} />
      <div className="lg-hero-fx-grain" />
      <div className="lg-hero-fx-vignette" />
    </motion.div>
  );
}

/** Magnetic hover for primary CTAs */
export function MagneticButton({
  children,
  className = "",
  href,
}: {
  children: ReactNode;
  className?: string;
  href: string;
}) {
  const reduce = usePrefersReducedMotion();
  const [pos, setPos] = useState({ x: 0, y: 0 });

  if (reduce) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  }

  return (
    <motion.a
      href={href}
      className={`${className} lg-magnetic`}
      animate={{ x: pos.x, y: pos.y }}
      transition={{ type: "spring", stiffness: 260, damping: 18, mass: 0.4 }}
      onMouseMove={(e) => {
        const r = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - (r.left + r.width / 2);
        const y = e.clientY - (r.top + r.height / 2);
        setPos({ x: x * 0.22, y: y * 0.22 });
      }}
      onMouseLeave={() => setPos({ x: 0, y: 0 })}
    >
      <span className="lg-magnetic-inner">{children}</span>
    </motion.a>
  );
}

/** Sticky book bar after scrolling past hero */
export function StickyBookBar({
  href,
  phone,
  phoneDial,
}: {
  href: string;
  phone: string;
  phoneDial: string;
}) {
  const reduce = usePrefersReducedMotion();
  const { scrollY } = useScroll();
  const visible = useTransform(scrollY, [380, 520], [0, 1]);
  const y = useTransform(scrollY, [380, 520], [24, 0]);

  if (reduce) {
    return (
      <div className="lg-sticky-book lg-sticky-book--static">
        <a href={href} className="lg-btn lg-btn-dark">
          Book now
        </a>
        <a href={`tel:${phoneDial}`} className="lg-sticky-phone">
          {phone}
        </a>
      </div>
    );
  }

  return (
    <motion.div
      className="lg-sticky-book"
      style={{ opacity: visible, y }}
      aria-label="Quick book"
    >
      <a href={href} className="lg-btn lg-btn-dark">
        Book now
      </a>
      <a href={`tel:${phoneDial}`} className="lg-sticky-phone">
        {phone}
      </a>
    </motion.div>
  );
}

/** Animated service row */
export function MotionMenuRow({
  children,
  index,
}: {
  children: ReactNode;
  index: number;
}) {
  const reduce = usePrefersReducedMotion();
  if (reduce) return <li>{children}</li>;
  return (
    <motion.li
      initial={{ opacity: 0, x: -16 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-5% 0px" }}
      transition={{
        duration: 0.55,
        delay: Math.min(index * 0.035, 0.4),
        ease: easeOut,
      }}
      whileHover={{ backgroundColor: "rgba(18,18,18,0.03)" }}
    >
      {children}
    </motion.li>
  );
}
