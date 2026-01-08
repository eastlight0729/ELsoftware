import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface FeatureLayoutProps {
  children: ReactNode;
  className?: string;
}

export const FeatureLayout = ({ children, className }: FeatureLayoutProps) => {
  return (
    <div
      className={cn(
        "w-full max-w-2xl mx-auto h-full flex flex-col relative pt-4 pb-32 px-4",
        className
      )}
    >
      {children}
    </div>
  );
};
