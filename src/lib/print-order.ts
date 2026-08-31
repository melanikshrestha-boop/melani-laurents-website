import { isValidEmail } from "@/lib/newsletter-shared";
import { findCatalogedPrint } from "@/lib/photography";

export interface PrintOrderRequest {
  name: string;
  email: string;
  shipTo: string;
  catalogId: string;
  title: string;
  sizeLabel: string;
  priceUsd: number;
}

type ParsedPrintOrder =
  | { ok: true; spam: true }
  | { ok: true; spam: false; data: PrintOrderRequest }
  | { ok: false; error: string };

export function parsePrintOrder(body: unknown): ParsedPrintOrder {
  if (!body || typeof body !== "object") {
    return { ok: false, error: "Invalid request body." };
  }

  const { name, email, shipTo, catalogId, title, size, company } = body as Record<
    string,
    unknown
  >;

  if (typeof company === "string" && company.trim()) {
    return { ok: true, spam: true };
  }

  if (typeof name !== "string" || !name.trim() || name.trim().length > 120) {
    return { ok: false, error: "Please enter your name." };
  }
  if (typeof email !== "string" || !isValidEmail(email)) {
    return { ok: false, error: "Please enter a valid email." };
  }
  if (typeof shipTo !== "string" || !shipTo.trim() || shipTo.trim().length > 240) {
    return { ok: false, error: "Please enter a shipping destination." };
  }
  if (typeof catalogId !== "string" || !catalogId.trim()) {
    return { ok: false, error: "That print is not available." };
  }
  if (typeof size !== "string" || !size.trim()) {
    return { ok: false, error: "Please choose a print size." };
  }

  const cataloged = findCatalogedPrint(catalogId.trim(), size.trim());
  if (!cataloged) {
    return { ok: false, error: "That print is not available." };
  }

  if (
    typeof title === "string" &&
    title.trim() &&
    title.trim() !== cataloged.print.title
  ) {
    return { ok: false, error: "That print is not available." };
  }

  return {
    ok: true,
    spam: false,
    data: {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      shipTo: shipTo.trim(),
      catalogId: cataloged.print.catalogId,
      title: cataloged.print.title,
      sizeLabel: cataloged.size.label,
      priceUsd: cataloged.size.priceUsd,
    },
  };
}
