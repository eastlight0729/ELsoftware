import { useState } from "react";
import { useMemoContent } from "../hooks/useMemoContent";
import { MemoEditor } from "./MemoEditor";
import { MemoPreview } from "./MemoPreview";
import { FeatureLayout } from "@/components/ui/FeatureLayout";
import { FeatureHeader } from "@/components/ui/FeatureHeader";
import { Eye, PenLine } from "lucide-react";

/**
 * The main Memo component.
 * Orchestrates the header, editor, and preview views.
 * Persists content via `useMemoContent`.
 */
export function Memo() {
  const { content, setContent } = useMemoContent();
  const [isPreview, setIsPreview] = useState(false);

  return (
    <FeatureLayout>
      <FeatureHeader
        title="Memo"
        subtitle="Capture thoughts and ideas"
      />

      {/* Content Area */}
      <div className="flex-1 bg-white dark:bg-neutral-900 rounded-3xl shadow-sm border border-neutral-200 dark:border-neutral-800 flex flex-col overflow-hidden min-h-[500px]">
        {/* Inner Header with Actions */}
        <div className="px-6 py-4 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between shrink-0">
          <h3 className="font-semibold text-neutral-700 dark:text-neutral-200">
            {isPreview ? "Preview" : "Editor"}
          </h3>
          <div className="flex items-center gap-3">
            <span className="text-xs text-neutral-400 font-medium hidden sm:block">
              {isPreview ? "Read Mode" : "Markdown Supported"}
            </span>
            <button
              onClick={() => setIsPreview(!isPreview)}
              className="p-2 text-neutral-500 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors cursor-pointer"
              title={isPreview ? "Switch to Editor" : "Switch to Preview"}
            >
              {isPreview ? <PenLine size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden relative">
          {isPreview ? (
            <MemoPreview content={content} />
          ) : (
            <MemoEditor content={content} onChange={setContent} />
          )}
        </div>
      </div>
    </FeatureLayout>
  );
}
