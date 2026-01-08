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
              value={backgroundPath}
              onChange={(e) => setBackgroundPath(e.target.value)}
              placeholder="Path or URL..."
              className="w-full rounded-md border border-white/20 dark:border-white/10 bg-white/50 dark:bg-black/20 backdrop-blur-sm px-3 py-2 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
            />
            {backgroundPath && (
              <button
                onClick={() => setBackgroundPath("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors"
                title="Clear image"
              >
                <X size={14} />
              </button>
            )}
          </div>
          <button
            onClick={() => handleSelect(setBackgroundPath)}
            className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-neutral-900 dark:text-neutral-100 hover:bg-white/20 transition-all shrink-0"
          >
            <FolderOpen size={16} />
            Select
          </button>
        </div>
      </div>
    </div>
  );
}
