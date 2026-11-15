/**
 * Facts the legal pages must state, kept in one place so the privacy policy,
 * the Impressum and the JSON-LD can never disagree about the operator.
 *
 * NOT LEGAL ADVICE. These pages are engineering drafts: a German lawyer (or
 * a generator such as eRecht24) should review them before the site is relied
 * on. The texts are deliberately written as an information offer, not as a
 * service contract, because that is what the site actually is.
 *
 * OPEN ITEMS, both in this file and both deliberate:
 *
 *   1. `name` is the label "Owner" rather than a natural person's name. A
 *      controller has to be identifiable by name under Art. 13(1)(a) GDPR and
 *      § 5 DDG, so this must become the real name before the pages are relied
 *      on — one string, and every page picks it up.
 *   2. `address` is null. § 5 DDG requires an operator to publish a postal
 *      address at which they can be reached; for the Impressum this is
 *      mandatory and email alone does not satisfy it, and for the privacy
 *      policy the controller's address is what Art. 13(1)(a) asks for. Every
 *      legal page renders `controllerAddress()` for itself, so filling this
 *      in is a single edit here.
 *
 * Until both are filled the legal pages are drafts, not compliant documents:
 * the Impressum in particular is incomplete and must not be treated as
 * meeting § 5 DDG.
 */
export type PostalAddress = {
  street: string;
  postalCode: string;
  city: string;
  country: string;
};

export const CONTROLLER = {
  name: "Owner",
  /** null means "not published yet" — see the open item above. */
  address: null as PostalAddress | null,
  email: "globalconnectforyou@gmail.com",
};

/** "street, postalCode city, country" — or null while the address is unset. */
export function controllerAddress(): string | null {
  const a = CONTROLLER.address;
  if (!a) return null;
  return `${a.street}, ${a.postalCode} ${a.city}, ${a.country}`;
}

/**
 * Third parties that handle data on the site's behalf (Art. 28 GDPR).
 * Keep roles factual: a reader should be able to check this list against the
 * privacy policy's "processors" section and find the same entries.
 */
export const PROCESSORS = [
  {
    name: "Vercel Inc.",
    role: "hosting, server logs, aggregate web analytics",
    location: "United States",
  },
  {
    name: "Contentful GmbH",
    role: "content storage — CMS records only, no visitor data",
    location: "Germany",
  },
  {
    name: "Google Ireland Limited",
    role: "YouTube, and only once a visitor starts a video",
    location: "Ireland",
  },
] as const;

/**
 * Art. 77 GDPR lets a complainant choose any supervisory authority, so the
 * policy does not need to name the Bundesland the operator lives in — which
 * this file deliberately does not record (see `address`). The URL is the
 * standing conference's index of the German authorities; the link text is
 * translated per locale in the message catalogs.
 */
export const COMPLAINT_AUTHORITY_URL =
  "https://www.datenschutzkonferenz-online.de/";

/** Date the legal texts were last revised; formatted per locale by the pages. */
export const POLICY_UPDATED = new Date(Date.UTC(2026, 10, 15));
