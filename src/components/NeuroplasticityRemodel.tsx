"use client";

import { motion, useReducedMotion } from "framer-motion";

const nodes = [
  [350, 165], [420, 125], [470, 205], [370, 255], [445, 330], [300, 300],
  [650, 165], [580, 125], [530, 205], [630, 255], [555, 330], [700, 300],
  [500, 270], [500, 375],
] as const;

const pathways = [
  [350, 165, 420, 125], [420, 125, 470, 205], [470, 205, 370, 255],
  [370, 255, 300, 300], [370, 255, 445, 330], [445, 330, 500, 375],
  [650, 165, 580, 125], [580, 125, 530, 205], [530, 205, 630, 255],
  [630, 255, 700, 300], [630, 255, 555, 330], [555, 330, 500, 375],
  [470, 205, 530, 205], [445, 330, 555, 330], [370, 255, 500, 270],
  [630, 255, 500, 270], [500, 270, 500, 375],
] as const;

const gyri = [
  "M315 175 C350 145 390 150 405 180 C420 210 395 225 360 215",
  "M285 235 C325 205 365 220 380 250 C392 278 360 292 325 278",
  "M350 112 C378 92 405 98 425 120",
  "M405 285 C420 265 455 270 470 295",
  "M685 175 C650 145 610 150 595 180 C580 210 605 225 640 215",
  "M715 235 C675 205 635 220 620 250 C608 278 640 292 675 278",
  "M650 112 C622 92 595 98 575 120",
  "M595 285 C580 265 545 270 530 295",
] as const;

export function NeuroplasticityRemodel() {
  const reduced = useReducedMotion();

  return (
    <div className="neuroplasticity-remodel" aria-label="Animated model of neuroplasticity remodeling pathways in the brain">
      <svg viewBox="0 0 1000 520" role="img">
        <title>Brain pathways strengthening, pruning, and rerouting</title>
        <defs>
          <clipPath id="brain-remodel-clip">
            <path d="M500 455C465 445 440 418 430 385C385 395 340 378 325 340C275 335 245 300 253 260C225 225 238 180 275 160C278 115 320 85 362 92C392 55 447 60 475 92C489 76 511 76 525 92C553 60 608 55 638 92C680 85 722 115 725 160C762 180 775 225 747 260C755 300 725 335 675 340C660 378 615 395 570 385C560 418 535 445 500 455Z" />
          </clipPath>
        </defs>

        <motion.path
          className="neuroplasticity-remodel__outline"
          d="M500 455C465 445 440 418 430 385C385 395 340 378 325 340C275 335 245 300 253 260C225 225 238 180 275 160C278 115 320 85 362 92C392 55 447 60 475 92C489 76 511 76 525 92C553 60 608 55 638 92C680 85 722 115 725 160C762 180 775 225 747 260C755 300 725 335 675 340C660 378 615 395 570 385C560 418 535 445 500 455Z"
          initial={reduced ? false : { pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 1.8, ease: [0.16, 1, 0.3, 1] }}
        />

        <g clipPath="url(#brain-remodel-clip)">
          {gyri.map((path, index) => (
            <motion.path
              className="neuroplasticity-remodel__gyrus"
              d={path}
              key={path}
              initial={reduced ? false : { pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, delay: 0.35 + index * 0.06 }}
            />
          ))}

          {pathways.map(([x1, y1, x2, y2], index) => (
            <motion.line
              className="neuroplasticity-remodel__pathway"
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              key={`${x1}-${y1}-${x2}-${y2}`}
              initial={reduced ? false : { pathLength: 0, opacity: 0 }}
              whileInView={reduced ? { pathLength: 1, opacity: 0.55 } : { pathLength: 1, opacity: [0.18, 0.9, 0.32] }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{
                pathLength: { duration: 0.9, delay: 0.55 + index * 0.045 },
                opacity: { duration: 3.2, delay: index * 0.16, repeat: Infinity, repeatType: "mirror" },
              }}
            />
          ))}

          {nodes.map(([cx, cy], index) => (
            <motion.circle
              className="neuroplasticity-remodel__node"
              cx={cx}
              cy={cy}
              r="5"
              key={`${cx}-${cy}`}
              initial={reduced ? false : { scale: 0, opacity: 0 }}
              whileInView={reduced ? { scale: 1, opacity: 0.8 } : { scale: [0.65, 1.35, 0.8], opacity: [0.35, 1, 0.55] }}
              viewport={{ once: true }}
              transition={{ duration: 2.6, delay: 0.7 + index * 0.07, repeat: reduced ? 0 : Infinity, repeatType: "mirror" }}
              style={{ transformOrigin: `${cx}px ${cy}px` }}
            />
          ))}

          {!reduced && (
            <>
              <motion.circle
                className="neuroplasticity-remodel__signal"
                r="4"
                animate={{ cx: [350, 420, 470, 500, 555, 630, 700], cy: [165, 125, 205, 270, 330, 255, 300], opacity: [0, 1, 1, 1, 1, 1, 0] }}
                transition={{ duration: 5.4, repeat: Infinity, ease: "linear" }}
              />
              <motion.circle
                className="neuroplasticity-remodel__signal"
                r="3"
                animate={{ cx: [650, 580, 530, 500, 445, 370, 300], cy: [165, 125, 205, 270, 330, 255, 300], opacity: [0, 1, 1, 1, 1, 1, 0] }}
                transition={{ duration: 6.2, delay: 1.1, repeat: Infinity, ease: "linear" }}
              />
            </>
          )}
        </g>
      </svg>

      <div className="neuroplasticity-remodel__legend" aria-hidden>
        <span>Strengthen</span>
        <span>Prune</span>
        <span>Reroute</span>
      </div>
    </div>
  );
}
