import { useRef, useState } from "react";
import { Image, FolderOpen, X } from "lucide-react";
import { useBackground } from "../hooks/useBackground";

export function BackgroundSettings() {
  const { backgroundPath, setBackgroundPath } = useBackground();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [activeUpdateConfig, setActiveUpdateConfig] = useState<((path: string) => void) | null>(null);

  const handleSelect = async (update: (path: string) => void) => {
    // 1. Try Electron Native Picker
    if (window.electron?.system) {
      try {
        const path = await window.electron.system.openFileDialog();
        if (path) {
          update(path);
        }
      } catch (error) {
        console.error("Failed to select file via Electron", error);
      }
      return;
    }

    // 2. Fallback to Web Picker (Base64)
    setActiveUpdateConfig(() => update);
    fileInputRef.current?.click();
  };

  const handleWebFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && activeUpdateConfig) {
      // Limit file size to avoid localStorage quota issues (e.g. 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert("Image is too large for web storage. Please use an image under 2MB or use the Electron app.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          activeUpdateConfig(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
    // Reset input
    if (fileInputRef.current) fileInputRef.current.value = "";
    setActiveUpdateConfig(null);
  };

  return (
    <div className="space-y-4">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleWebFileChange}
        accept="image/*"
        className="hidden"
      />
      <h3 className="text-sm font-medium text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
        <Image size={16} />
        Background Settings
      </h3>
      <div className="space-y-2">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={backgroundPath}
              onChange={(e) => setBackgroundPath(e.target.value)}
              placeholder="Path or URL..."
              className="w-full rounded-md border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 px-3 py-2 text-sm text-neutral-600 dark:text-neutral-300 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-500"
            />
            {backgroundPath && (
              <button
                onClick={() => setBackgroundPath("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors"
                title="Clear image"
              >
                <X size={14} />
              </button>
            )}
          </div>
          <button
            onClick={() => handleSelect(setBackgroundPath)}
            className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-md text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors shrink-0"
          >
            <FolderOpen size={16} />
            Select
          </button>
        </div>
      </div>
    </div>
  );
}
