import { useState } from "react";
import { useMemoContent } from "../hooks/useMemoContent";
import { MemoHeader } from "./MemoHeader";
import { MemoEditor } from "./MemoEditor";
import { MemoPreview } from "./MemoPreview";

/**
 * The main Memo component.
 * Orchestrates the header, editor, and preview views.
 * Persists content via `useMemoContent`.
 */
export function Memo() {
  const { content, setContent } = useMemoContent();
  const [isPreview, setIsPreview] = useState(false);

  return (
    <div className="w-full h-[75vh] bg-white dark:bg-neutral-900 rounded-3xl shadow-sm border border-neutral-200 dark:border-neutral-800 flex flex-col overflow-hidden">
      <MemoHeader isPreview={isPreview} onTogglePreview={() => setIsPreview(!isPreview)} />

      {/* Content Area */}
      <div className="flex-1 overflow-hidden relative">
        {isPreview ? <MemoPreview content={content} /> : <MemoEditor content={content} onChange={setContent} />}
      </div>
    </div>
  );
}
