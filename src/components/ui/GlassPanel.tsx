import { cn } from "@/lib/utils";
import { forwardRef } from "react";

export const GlassPanel = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-white/10 backdrop-blur-md border border-white/20 shadow-lg rounded-xl flex flex-col",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);
GlassPanel.displayName = "GlassPanel";

export const GlassPanelHeader = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("p-3 flex items-center justify-between border-b border-white/10 shrink-0", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
GlassPanelHeader.displayName = "GlassPanelHeader";

export const GlassPanelContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex-1 min-h-0 p-2", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);
GlassPanelContent.displayName = "GlassPanelContent";
