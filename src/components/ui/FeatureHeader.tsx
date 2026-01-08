import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface FeatureHeaderProps {
  /** The main title of the view */
  title: string;
  /** The subtitle or description text */
  subtitle: string;
  /** Optional action element (e.g. button) displayed on the right */
  action?: ReactNode;
  /** Optional extra classes */
  className?: string;
}

/**
 * A standardized header component for feature views.
 * Ensures consistent typography and layout across the application.
 */
export function FeatureHeader({ title, subtitle, action, className }: FeatureHeaderProps) {
  return (
    <header className={twMerge("flex items-center justify-between mb-8", className)}>
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-md">{title}</h1>
        <p className="text-white/80 font-medium">{subtitle}</p>
      </div>
      {action && (
        <div className="ml-4 shrink-0">
          {action}
        </div>
      )}
    </header>
  );
}
