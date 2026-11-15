import { getT } from "@/i18n/t";
import { Link } from "@/i18n/navigation";
import { PageContainer, PageMain } from "@/components/page-shell";
import { Button } from "@/components/ui/button";
import { tv } from "@/lib/utils";

const notFoundPage = tv({
  slots: {
    root: "flex flex-col items-center gap-4 py-24",
    code: "font-display text-6xl text-foreground",
    title: "font-display text-3xl text-foreground",
    text: "max-w-md text-muted-foreground",
  },
});

/** Localized 404 — rendered for unknown locales and unknown routes. */
export default async function NotFoundPage() {
  const t = await getT("NotFound");
  const slots = notFoundPage();

  return (
    <PageMain>
      <PageContainer size="narrow" spacing="bottom" center>
        <div className={slots.root()}>
          <p className={slots.code()}>404</p>
          <h1 className={slots.title()}>{t("title")}</h1>
          <p className={slots.text()}>{t("description")}</p>
          <Button render={<Link href="/" />}>{t("home")}</Button>
        </div>
      </PageContainer>
    </PageMain>
  );
}
