import { forwardRef } from "react";

import { cn } from "@/lib/utils";

export const Card = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-3xl border border-border/80 bg-panel/85 shadow-panel backdrop-blur-xl transition duration-300",
        className
      )}
      {...props}
    />
  )
);

Card.displayName = "Card";

export const Button = forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement>>(
  ({ className, type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(
        "inline-flex items-center justify-center rounded-full bg-gradient-to-r from-primary to-sky-500 px-4 py-2 text-sm font-semibold text-white shadow-glow transition duration-200 hover:-translate-y-0.5 hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:cursor-not-allowed disabled:opacity-60",
        className
      )}
      {...props}
    />
  )
);

Button.displayName = "Button";

export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "w-full rounded-2xl border border-border bg-white/95 px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted shadow-sm transition focus:border-primary focus:ring-2 focus:ring-primary/20",
        className
      )}
      {...props}
    />
  )
);

Input.displayName = "Input";

export const Select = forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        "w-full rounded-2xl border border-border bg-white/95 px-4 py-3 text-sm text-foreground outline-none shadow-sm transition focus:border-primary focus:ring-2 focus:ring-primary/20",
        className
      )}
      {...props}
    />
  )
);

Select.displayName = "Select";

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "min-h-28 w-full rounded-2xl border border-border bg-white/95 px-4 py-3 text-sm text-foreground outline-none shadow-sm transition focus:border-primary focus:ring-2 focus:ring-primary/20",
      className
    )}
    {...props}
  />
));

Textarea.displayName = "Textarea";
