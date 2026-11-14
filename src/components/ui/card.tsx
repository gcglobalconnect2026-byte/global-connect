import * as React from "react";

import { tv } from "@/lib/utils";

const card = tv({
  slots: {
    root: "group/card flex flex-col gap-(--card-spacing) overflow-hidden rounded-3xl border border-border bg-card/80 py-(--card-spacing) text-sm text-card-foreground [--card-spacing:--spacing(4)] has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 data-[size=sm]:[--card-spacing:--spacing(3)] data-[size=sm]:has-data-[slot=card-footer]:pb-0 *:[img:first-child]:rounded-t-3xl *:[img:last-child]:rounded-b-3xl",
    header:
      "group/card-header @container/card-header grid auto-rows-min items-start gap-1 rounded-t-3xl px-(--card-spacing) has-data-[slot=card-action]:grid-cols-[1fr_auto] has-data-[slot=card-description]:grid-rows-[auto_auto] [.border-b]:pb-(--card-spacing)",
    title:
      "font-heading text-base leading-snug font-medium group-data-[size=sm]/card:text-sm",
    description: "text-sm text-muted-foreground",
    action: "col-start-2 row-span-2 row-start-1 self-start justify-self-end",
    content: "px-(--card-spacing)",
    footer:
      "flex items-center rounded-b-3xl border-t border-border/70 bg-card/40 p-(--card-spacing)",
  },
});

function Card({
  className,
  size = "default",
  ...props
}: React.ComponentProps<"div"> & { size?: "default" | "sm" }) {
  const slots = card();
  return (
    <div
      data-slot="card"
      data-size={size}
      className={slots.root({ class: className })}
      {...props}
    />
  );
}

function CardHeader({ className, ...props }: React.ComponentProps<"div">) {
  const slots = card();
  return (
    <div
      data-slot="card-header"
      className={slots.header({ class: className })}
      {...props}
    />
  );
}

function CardTitle({ className, ...props }: React.ComponentProps<"div">) {
  const slots = card();
  return (
    <div
      data-slot="card-title"
      className={slots.title({ class: className })}
      {...props}
    />
  );
}

function CardDescription({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const slots = card();
  return (
    <div
      data-slot="card-description"
      className={slots.description({ class: className })}
      {...props}
    />
  );
}

function CardAction({ className, ...props }: React.ComponentProps<"div">) {
  const slots = card();
  return (
    <div
      data-slot="card-action"
      className={slots.action({ class: className })}
      {...props}
    />
  );
}

function CardContent({ className, ...props }: React.ComponentProps<"div">) {
  const slots = card();
  return (
    <div
      data-slot="card-content"
      className={slots.content({ class: className })}
      {...props}
    />
  );
}

function CardFooter({ className, ...props }: React.ComponentProps<"div">) {
  const slots = card();
  return (
    <div
      data-slot="card-footer"
      className={slots.footer({ class: className })}
      {...props}
    />
  );
}

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
}
