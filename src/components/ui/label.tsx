"use client"

import * as React from "react"

import { tv } from "@/lib/utils"

const label = tv({
  base: "flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
});

function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      data-slot="label"
      className={label({ class: className })}
      {...props}
    />
  )
}

export { Label }
