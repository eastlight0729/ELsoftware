import { ButtonHTMLAttributes, ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface HeaderIconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

/**
 * A standardized icon button for use in feature headers.
 * Matches the glassmorphism style of the application.
 */
export function HeaderIconButton({ children, className, ...props }: HeaderIconButtonProps) {
  return (
    <button
      type="button"
      className={twMerge(
        "p-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all border border-white/10 shadow-lg hover:scale-105 cursor-pointer flex items-center justify-center",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
