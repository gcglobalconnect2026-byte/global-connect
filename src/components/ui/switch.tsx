"use client"

import { Switch as SwitchPrimitive } from "@base-ui/react/switch"

import { mergeClass, tv } from "@/lib/utils"

const switchVariants = tv({
  slots: {
    base: "peer inline-flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 outline-none transition-colors select-none focus-visible:ring-3 focus-visible:ring-ring/50 data-checked:bg-primary data-unchecked:bg-input disabled:cursor-not-allowed disabled:opacity-50",
    thumb: "block size-4 rounded-full bg-background transition-transform data-checked:translate-x-4 data-unchecked:translate-x-0",
  },
})

function Switch({ className, ...props }: SwitchPrimitive.Root.Props) {
  const slots = switchVariants()
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={mergeClass(slots.base(), className)}
      {...props}
    >
      <SwitchPrimitive.Thumb className={slots.thumb()} />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
