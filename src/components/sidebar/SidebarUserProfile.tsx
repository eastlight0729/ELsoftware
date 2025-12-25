import { useState } from "react";
import { LogOut } from "lucide-react";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

interface SidebarUserProfileProps {
  email?: string | null;
  isOpen: boolean;
  onLogout: () => void;
}

export function SidebarUserProfile({ email, isOpen, onLogout }: SidebarUserProfileProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogout = () => {
    onLogout();
    setShowConfirm(false);
  };

  return (
    <>
      <div
        className={`px-4 mb-6 transition-all duration-300 ease-in-out ${
          isOpen ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4 hidden"
        }`}
      >
        <div className="flex items-center gap-3 p-3 rounded-xl bg-neutral-100/50 dark:bg-neutral-800/50 border border-neutral-200/50 dark:border-neutral-700/50 group">
          <div className="h-8 w-8 rounded-full bg-linear-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs shadow-sm shrink-0">
            {email?.charAt(0).toUpperCase() || "U"}
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-[10px] uppercase tracking-wider font-bold text-neutral-400">Account</span>
            <span
              className="text-xs font-medium text-neutral-700 dark:text-neutral-200 truncate pr-2"
              title={email || ""}
            >
              {email}
            </span>
          </div>
          <button
            onClick={() => setShowConfirm(true)}
            className="ml-auto p-1.5 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors cursor-pointer"
            title="Sign out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>

      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleLogout}
        title="Sign Out"
        message="Are you sure you want to sign out of your account?"
        confirmLabel="Sign Out"
        variant="danger"
      />
    </>
  );
}
