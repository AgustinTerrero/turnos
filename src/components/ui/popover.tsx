import * as React from "react"
import * as PopoverPrimitive from "@radix-ui/react-popover"
import { cn } from "@/lib/utils"

export function Popover({ open, onOpenChange, children }: {
  open: boolean,
  onOpenChange: (open: boolean) => void,
  children: React.ReactNode
}) {
  return (
    <PopoverPrimitive.Root open={open} onOpenChange={onOpenChange}>
      {children}
    </PopoverPrimitive.Root>
  )
}

export function PopoverTrigger({ asChild = false, children }: {
  asChild?: boolean,
  children: React.ReactNode
}) {
  return (
    <PopoverPrimitive.Trigger asChild={asChild}>
      {children}
    </PopoverPrimitive.Trigger>
  )
}

export function PopoverContent({ className, children }: {
  className?: string,
  children: React.ReactNode
}) {
  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Content
        className={cn(
          "z-50 w-auto rounded-xl border border-gray-200 bg-white p-4 shadow-xl outline-none animate-in fade-in-0 zoom-in-95",
          className
        )}
        sideOffset={8}
      >
        {children}
      </PopoverPrimitive.Content>
    </PopoverPrimitive.Portal>
  )
}
