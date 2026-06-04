import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const variants = {
  default: "bg-primary text-primary-foreground hover:bg-primary/90",
  gold: "btn-gold text-[#0B0B0B] font-display font-semibold",
  outline: "border border-border bg-transparent hover:bg-secondary text-foreground",
  ghost: "hover:bg-secondary text-foreground",
  destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  link: "text-primary underline-offset-4 hover:underline p-0 h-auto",
  secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
};

const sizes = {
  sm: "h-8 px-3 text-xs rounded-md",
  default: "h-10 px-5 text-sm rounded-lg",
  lg: "h-12 px-8 text-base rounded-xl",
  xl: "h-14 px-10 text-base rounded-xl",
  icon: "h-10 w-10 rounded-lg",
};

export const Button = forwardRef(({ className, variant = "default", size = "default", loading, children, disabled, ...props }, ref) => (
  <button
    ref={ref}
    disabled={disabled || loading}
    className={cn(
      "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 cursor-pointer select-none",
      variants[variant],
      sizes[size],
      className
    )}
    {...props}
  >
    {loading ? (
      <>
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        {children}
      </>
    ) : children}
  </button>
));
Button.displayName = "Button";
