import * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "flex h-10 w-full rounded-xl border border-[#E8D4F8] bg-white px-3 py-2 text-base text-[#1E1B4B] transition-all",
        "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-[#1E1B4B]",
        "placeholder:text-[#9CA3AF]",
        "focus:border-[#A89CFF] focus:outline-none focus:ring-2 focus:ring-[#A89CFF]/50",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "hover:border-[#A89CFF]/70 hover:shadow-md",
        "md:text-sm",
        className
      )}
      {...props}
    />
  )
}

export { Input }
