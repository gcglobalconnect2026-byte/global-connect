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
  },
});

/** Full legal route: header, page header, prose container, footer. */
export function LegalPage({
  title,
  eyebrow,
  children,
}: {
  title: string;
  eyebrow: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <SiteHeader />
      <PageMain>
        <PageHeader title={title} eyebrow={eyebrow} />
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
