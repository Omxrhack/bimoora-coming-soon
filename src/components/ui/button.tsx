import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[#A89CFF]/50 focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-gradient-to-r from-[#A89CFF] to-[#E8D4F8] text-white shadow-lg shadow-[#A89CFF]/25 hover:opacity-90",
        destructive:
          "bg-red-500 text-white shadow-sm hover:bg-red-500/90",
        outline:
          "border border-[#E8D4F8] bg-transparent hover:bg-[#E8D4F8]/10 text-[#1E1B4B]",
        secondary:
          "bg-[#E8D4F8] text-[#1E1B4B] shadow-sm hover:bg-[#E8D4F8]/80",
        ghost: "hover:bg-[#E8D4F8]/20 text-[#1E1B4B]",
        link: "text-[#A89CFF] underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-8 rounded-lg px-3 text-xs",
        lg: "h-12 rounded-xl px-6 text-base",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp 
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
