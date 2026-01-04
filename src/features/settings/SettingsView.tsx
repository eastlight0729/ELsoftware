import { useState } from "react";
import { LogOut, User } from "lucide-react";
import { ConfirmModal } from "@/components/ui/ConfirmModal";

interface SettingsViewProps {
  userEmail?: string | null;
  onLogout: () => void;
}

export function SettingsView({ userEmail, onLogout }: SettingsViewProps) {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    onLogout();
    setShowLogoutConfirm(false);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">Settings</h1>
        <p className="text-neutral-500 dark:text-neutral-400">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="bg-white dark:bg-neutral-900 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm p-6 space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="h-16 w-16 rounded-full bg-linear-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white font-bold text-2xl shadow-md shrink-0">
              {userEmail?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="space-y-1 min-w-0">
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 truncate">Account</h2>
              <div className="flex items-center gap-2 text-sm text-neutral-500 dark:text-neutral-400">
                <User size={14} className="shrink-0" />
                <span className="truncate" title={userEmail || ""}>{userEmail}</span>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => setShowLogoutConfirm(true)}
            title="Sign Out"
            className="flex items-center justify-center p-2 text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-lg transition-colors cursor-pointer shrink-0"
          >
            <LogOut size={20} />
          </button>
        </div>

        <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800">
          <h3 className="text-sm font-medium text-neutral-900 dark:text-neutral-100 mb-4">Application Details</h3>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-neutral-500 dark:text-neutral-400">Version</dt>
              <dd className="font-medium text-neutral-900 dark:text-neutral-100">1.0.0</dd>
            </div>
            <div>
              <dt className="text-neutral-500 dark:text-neutral-400">Theme</dt>
              <dd className="font-medium text-neutral-900 dark:text-neutral-100">System Default</dd>
            </div>
          </dl>
        </div>
      </div>

      <ConfirmModal
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
        title="Sign Out"
        message={`Are you sure you want to sign out of ${userEmail}?`}
        confirmLabel="Sign Out"
        variant="danger"
      />
    </div>
  );
}
