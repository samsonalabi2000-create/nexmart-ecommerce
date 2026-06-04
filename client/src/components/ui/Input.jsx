import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Input = forwardRef(({ className, type = "text", error, label, icon, ...props }, ref) => (
  <div className="w-full">
    {label && <label className="block text-sm font-medium text-foreground mb-1.5">{label}</label>}
    <div className="relative">
      {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">{icon}</span>}
      <input
        ref={ref}
        type={type}
        className={cn(
          "input-dark h-11",
          icon && "pl-10",
          error && "border-destructive focus:border-destructive",
          className
        )}
        {...props}
      />
    </div>
    {error && <p className="mt-1 text-xs text-destructive">{error}</p>}
  </div>
));
Input.displayName = "Input";
