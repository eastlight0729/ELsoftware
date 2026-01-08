import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface ItemCardProps extends React.HTMLAttributes<HTMLDivElement> {
  isDragging?: boolean;
  actions?: React.ReactNode;
}

export const ItemCard = forwardRef<HTMLDivElement, ItemCardProps>(
  ({ className, isDragging, children, actions, style, ...props }, ref) => {
    if (isDragging) {
      return (
        <div
          ref={ref}
          style={style}
          className={cn(
            "bg-white/20 p-3 rounded-xl border border-white/30 opacity-50 h-[100px]",
            className
          )}
          {...props}
        />
      );
    }

    return (
      <div
        ref={ref}
        style={style}
        className={cn(
          "group relative bg-white/40 hover:bg-white/60 p-4 rounded-xl shadow-sm border border-white/20 backdrop-blur-sm transition-all touch-none cursor-pointer",
          className
        )}
        {...props}
      >
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            {children}
          </div>
          {actions && (
            <div className="flex items-center gap-1 shrink-0">
              {actions}
            </div>
          )}
        </div>
      </div>
    );
  }
);

ItemCard.displayName = "ItemCard";

export const ItemCardContent = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "text-sm text-white/90 font-medium whitespace-pre-wrap wrap-break-word leading-relaxed",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ItemCardContent.displayName = "ItemCardContent";

interface ItemCardActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "info" | "danger";
}

export const ItemCardActionButton = forwardRef<HTMLButtonElement, ItemCardActionButtonProps>(
  ({ className, variant = "default", ...props }, ref) => {
    const variantStyles = {
      default: "hover:text-white",
      info: "hover:text-sky-400",
      danger: "hover:text-orange-400",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "p-1.5 text-white/70 hover:bg-white/20 rounded-lg transition-colors",
          variantStyles[variant],
          className
        )}
        {...props}
      />
    );
  }
);

ItemCardActionButton.displayName = "ItemCardActionButton";
