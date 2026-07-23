"use client";

/**
 * Service detail drawer — click a service → exact process explained.
 * Why: clients should know what happens before they book (brows, facials, etc.).
 * How: slide-over panel + expert data from lunara-expertise.
 */

import { useEffect } from "react";
import Link from "next/link";
import { AddToBagButton } from "@/components/ServiceCart";
import { useI18n } from "@/lib/i18n";
import { getExpertByName, type ServiceExpert } from "@/lib/lunara-expertise";

export type DrawerService = {
  name: string;
  categoryId: string;
  categoryTitle: string;
  price: string;
  time: string;
  description?: string;
};

type Props = {
  service: DrawerService | null;
  onClose: () => void;
};

export function ServiceDetailDrawer({ service, onClose }: Props) {
  const { t } = useI18n();
  const open = Boolean(service);
  const expert: ServiceExpert | undefined = service
    ? getExpertByName(service.name)
    : undefined;

  // Lock body scroll while open; Escape closes
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!service) return null;

  const summary =
    expert?.summary ||
    service.description ||
    "Premium care with a clear process — ask us any question when you arrive.";
  const whatHappens =
    expert?.whatHappens ||
    service.description ||
    "We consult, prep, perform the service carefully, then finish with aftercare notes.";
  const bestFor = expert?.bestFor;
  const ingredients = expert?.ingredients;
  const aftercare = expert?.aftercare;

  return (
    <div
      className={`lg-drawer-root${open ? " is-open" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="lg-drawer-title"
    >
      {/* Dim backdrop — click to close */}
      <button
        type="button"
        className="lg-drawer-backdrop"
        aria-label={t("drawerClose")}
        onClick={onClose}
      />

      <aside className="lg-drawer-panel">
        <header className="lg-drawer-head">
          <p className="lg-drawer-kicker">{t("drawerProcess")}</p>
          <button
            type="button"
            className="lg-drawer-x"
            onClick={onClose}
            aria-label={t("drawerClose")}
          >
            ×
          </button>
        </header>

        <div className="lg-drawer-body">
          <p className="lg-drawer-cat">{service.categoryTitle}</p>
          <h2 id="lg-drawer-title" className="lg-drawer-title">
            {service.name}
          </h2>
          <p className="lg-drawer-meta">
            <span>{service.price}</span>
            <span className="lg-menu-sep" aria-hidden>
              /
            </span>
            <span>{service.time}</span>
          </p>

          <p className="lg-drawer-summary">{summary}</p>

          {bestFor ? (
            <section className="lg-drawer-block">
              <h3>{t("drawerBestFor")}</h3>
              <p>{bestFor}</p>
            </section>
          ) : null}

          <section className="lg-drawer-block">
            <h3>{t("drawerWhatHappens")}</h3>
            <p>{whatHappens}</p>
          </section>

          {ingredients ? (
            <section className="lg-drawer-block">
              <h3>{t("drawerIngredients")}</h3>
              <p>{ingredients}</p>
            </section>
          ) : null}

          {aftercare ? (
            <section className="lg-drawer-block">
              <h3>{t("drawerAftercare")}</h3>
              <p>{aftercare}</p>
            </section>
          ) : null}
        </div>

        <footer className="lg-drawer-foot">
          <AddToBagButton
            name={service.name}
            categoryId={service.categoryId}
            categoryTitle={service.categoryTitle}
            price={service.price}
            time={service.time}
          />
          <Link href="/book" className="button-primary" onClick={onClose}>
            {t("drawerBook")}
          </Link>
        </footer>
      </aside>
    </div>
  );
}

/** Small “more info” control used on each menu row */
export function MoreInfoButton({
  onClick,
  label,
}: {
  onClick: () => void;
  label: string;
}) {
  return (
    <button type="button" className="lg-more-info" onClick={onClick}>
      {label}
    </button>
  );
}
