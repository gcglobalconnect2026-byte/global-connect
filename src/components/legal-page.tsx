import * as React from "react";

import { tv } from "@/lib/utils";
import { PageHeader } from "@/components/page-header";
import { PageContainer, PageMain } from "@/components/page-shell";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const legalPage = tv({
  slots: {
    section: "mb-8",
    title: "mb-2 text-lg font-semibold",
    body: "text-muted-foreground",
    list: "mt-2 list-disc space-y-1.5 pl-5",
    term: "mb-1 font-medium text-foreground",
  },
});

/** Full legal route: header, page header, prose container, footer. */
export function LegalPage({
  title,
  eyebrow,
  description,
  children,
}: {
  title: string;
  eyebrow: string;
  /** Optional subtitle — the privacy/terms pages use it for the revision date. */
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteHeader />
      <PageMain>
        <PageHeader title={title} eyebrow={eyebrow} description={description} />
        <PageContainer size="narrow" spacing="bottom">
          {children}
        </PageContainer>
      </PageMain>
      <SiteFooter />
    </>
  );
}

export function LegalSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const slots = legalPage();
  return (
    <section className={slots.section()}>
      <h2 className={slots.title()}>{title}</h2>
      <div className={slots.body()}>{children}</div>
    </section>
  );
}

/**
 * Bulleted facts inside a section — the processors table and the rights list
 * both use it. The list is static per locale, so index keys are stable.
 */
export function LegalList({ items }: { items: React.ReactNode[] }) {
  const slots = legalPage();
  return (
    <ul className={slots.list()}>
      {items.map((item, index) => (
        <li key={index}>{item}</li>
      ))}
    </ul>
  );
}
