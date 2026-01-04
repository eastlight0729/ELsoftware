import { useState } from "react";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

interface NavigationUserProfileProps {
  email?: string | null;
  onLogout: () => void;
}

export function NavigationUserProfile({ email, onLogout }: NavigationUserProfileProps) {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleLogout = () => {
    onLogout();
    setShowConfirm(false);
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="group relative flex items-center justify-center p-0.5 rounded-full transition-transform hover:scale-105 active:scale-95 focus:outline-hidden"
        title={`Sign out (${email})`}
      >
        <div className="h-8 w-8 rounded-full bg-linear-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs shadow-sm ring-2 ring-transparent group-hover:ring-neutral-200 dark:group-hover:ring-neutral-700 transition-all">
          {email?.charAt(0).toUpperCase() || "U"}
        </div>
      </button>

      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleLogout}
        title="Sign Out"
        message={`Are you sure you want to sign out of ${email}?`}
        confirmLabel="Sign Out"
        variant="danger"
      />
    </>
  );
}
