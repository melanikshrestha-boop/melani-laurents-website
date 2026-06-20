"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

/** Carlo Doroff–style stacked display name — black on cream. */
export function DisplayNameHero() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut" as const,
      },
    },
  };

  return (
    <section className="display-name-hero relative min-h-screen overflow-hidden">
      <motion.div
        className="display-name-hero__frame display-name-hero__frame--left"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      />
      <motion.div
        className="display-name-hero__frame display-name-hero__frame--right"
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
      />
      <motion.span
        className="display-name-hero__dot"
        aria-hidden
        animate={{
          boxShadow: [
            "0 0 8px rgba(239, 68, 35, 0.45)",
            "0 0 20px rgba(239, 68, 35, 0.65)",
            "0 0 8px rgba(239, 68, 35, 0.45)",
          ],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.header
        className="display-name-hero__meta display-name-hero__meta--top"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.span className="display-name-hero__tags" variants={itemVariants}>
          always creating
          <span className="display-name-hero__sep" aria-hidden>
            ·
          </span>
          <span className="display-name-hero__loc">
            <span className="display-name-hero__red-dot" aria-hidden />
            LA / SF / NYC
          </span>
          <span className="display-name-hero__sep" aria-hidden>
            ·
          </span>
          med-tech enthusiast
          <span className="display-name-hero__sep" aria-hidden>
            ·
          </span>
          art
        </motion.span>
        <motion.span className="display-name-hero__edition" variants={itemVariants}>
          01 / 01 / portfolio · v2026.1
        </motion.span>
      </motion.header>

      <div className="display-name-hero__center">
        <motion.h1
          className="display-name-hero__title"
          aria-label="Melani Laurent S."
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.span
            className="display-name-hero__line"
            variants={itemVariants}
            style={{
              transform: `perspective(1000px) rotateX(${mousePosition.y * 0.5}deg) rotateY(${-mousePosition.x * 0.5}deg)`,
            }}
          >
            MELANI
          </motion.span>
          <motion.span
            className="display-name-hero__line"
            variants={itemVariants}
            style={{
              transform: `perspective(1000px) rotateX(${mousePosition.y * 0.5}deg) rotateY(${-mousePosition.x * 0.5}deg)`,
            }}
          >
            LAURENT S.
          </motion.span>
        </motion.h1>
      </div>

      <motion.footer
        className="display-name-hero__meta display-name-hero__meta--bottom"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.p className="display-name-hero__bio max-w-xl" variants={itemVariants}>
          Med-tech, photography, cinema — all under art. Always creating from
          LA, SF, and NYC.
        </motion.p>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link href="/about" className="display-name-hero__link display-name-hero__link--animated">
            enter the archive →
          </Link>
        </motion.div>
      </motion.footer>
    </section>
  );
}

export function DisplayNameHeroStatic() {
  return <DisplayNameHero />;
}
