"use client";

import Script from "next/script";
import { useRef } from "react";

declare global {
  interface Window {
    twttr?: {
      widgets?: {
        load: (element?: HTMLElement | null) => void;
      };
    };
  }
}

const X_PROFILE_URL = "https://x.com/MelaniShrestha";
const LINKEDIN_URL = "https://www.linkedin.com/in/melanilaurents/";

export function XRecentPosts() {
  const timelineRef = useRef<HTMLDivElement>(null);

  const loadTimeline = () => {
    window.twttr?.widgets?.load(timelineRef.current);
  };

  return (
    <section className="daily-x-feed" aria-labelledby="daily-x-feed-title">
      <div className="daily-x-feed__intro">
        <p className="daily-index__kicker">Recent on X</p>
        <h2 id="daily-x-feed-title">The short-form record.</h2>
        <p>
          Quotes, notes, and ideas as they happen. New public posts appear here
          automatically.
        </p>
        <div className="daily-x-feed__links">
          <a href={X_PROFILE_URL} target="_blank" rel="noopener noreferrer">
            Follow on X ↗
          </a>
          <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer">
            Connect on LinkedIn ↗
          </a>
        </div>
      </div>

      <div ref={timelineRef} className="daily-x-feed__timeline">
        <a
          className="twitter-timeline"
          data-height="540"
          data-theme="light"
          data-chrome="noheader nofooter noborders transparent"
          data-dnt="true"
          data-tweet-limit="4"
          href={X_PROFILE_URL}
        >
          View recent posts by @MelaniShrestha
        </a>
      </div>

      <Script
        id="x-widgets"
        src="https://platform.twitter.com/widgets.js"
        strategy="afterInteractive"
        onLoad={loadTimeline}
      />
    </section>
  );
}
