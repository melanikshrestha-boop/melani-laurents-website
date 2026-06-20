"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { InteractiveTitleLetters } from "./InteractiveTitleLetters";

/** Carlo Doroff–style stacked display name — black on cream. */
export function DisplayNameHero() {
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

      <motion.div
        className="display-name-hero__center"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div variants={itemVariants}>
          <InteractiveTitleLetters
            variant="cream"
            className="display-name-hero__title"
            lineClassName="display-name-hero__line"
          />
        </motion.div>
      </motion.div>

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
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
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
