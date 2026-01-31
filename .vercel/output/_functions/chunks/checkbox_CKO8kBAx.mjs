import { jsx } from 'react/jsx-runtime';
import { c as cn } from './CustomToast_YZEZrSNm.mjs';
import * as LabelPrimitive from '@radix-ui/react-label';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Check } from 'lucide-react';

function Input({ className, type, ...props }) {
  return /* @__PURE__ */ jsx(
    "input",
    {
      type,
      "data-slot": "input",
      className: cn(
        "flex h-10 w-full rounded-xl border border-[#E8D4F8] bg-white px-3 py-2 text-base text-[#1E1B4B] transition-all",
        "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-[#1E1B4B]",
        "placeholder:text-[#9CA3AF]",
        "focus:border-[#A89CFF] focus:outline-none focus:ring-2 focus:ring-[#A89CFF]/50",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "hover:border-[#A89CFF]/70 hover:shadow-md",
        "md:text-sm",
        className
      ),
      ...props
    }
  );
}

function Label({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    LabelPrimitive.Root,
    {
      "data-slot": "label",
      className: cn(
        "text-sm font-medium text-[#1E1B4B] leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        className
      ),
      ...props
    }
  );
}

function Checkbox({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsx(
    CheckboxPrimitive.Root,
    {
      "data-slot": "checkbox",
      className: cn(
        "peer size-4 shrink-0 rounded border border-[#E8D4F8] shadow-sm",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#A89CFF]/50 focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "data-[state=checked]:bg-[#A89CFF] data-[state=checked]:border-[#A89CFF] data-[state=checked]:text-white",
        className
      ),
      ...props,
      children: /* @__PURE__ */ jsx(
        CheckboxPrimitive.Indicator,
        {
          "data-slot": "checkbox-indicator",
          className: "flex items-center justify-center text-current",
          children: /* @__PURE__ */ jsx(Check, { className: "size-3.5" })
        }
      )
    }
  );
}

export { Checkbox as C, Input as I, Label as L };
