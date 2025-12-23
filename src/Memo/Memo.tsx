import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Eye, PenLine } from "lucide-react";

export function Memo() {
  const [content, setContent] = useState<string>(() => {
    try {
      return localStorage.getItem("memo-content") || "# My Memo\n\nStart writing...";
    } catch {
      return "# My Memo\n\nStart writing...";
    }
  });

  const [isPreview, setIsPreview] = useState(false);

  useEffect(() => {
    localStorage.setItem("memo-content", content);
  }, [content]);

  return (
    <div className="w-full h-[75vh] bg-white dark:bg-neutral-900 rounded-3xl shadow-sm border border-neutral-200 dark:border-neutral-800 flex flex-col overflow-hidden">
      {/* Header with Toggle */}
      <div className="px-6 py-4 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between shrink-0">
        <h3 className="font-semibold text-neutral-700 dark:text-neutral-200">{isPreview ? "Preview" : "Editor"}</h3>
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

      {/* Content Area */}
      <div className="flex-1 overflow-hidden relative">
        {isPreview ? (
          // Preview View
          <div className="w-full h-full p-6 overflow-y-auto bg-neutral-50/30 dark:bg-neutral-900/30">
            <article className="prose prose-sm md:prose-base prose-neutral dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-blue-600 dark:prose-a:text-blue-400 hover:prose-a:underline">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
            </article>
          </div>
        ) : (
          // Editor View
          <textarea
            className="w-full h-full p-6 resize-none bg-transparent outline-none text-neutral-800 dark:text-neutral-200 font-mono text-sm leading-relaxed placeholder:text-neutral-400 focus:bg-neutral-50/50 dark:focus:bg-neutral-800/50 transition-colors"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Type your markdown here..."
            spellCheck={false}
          />
        )}
      </div>
    </div>
  );
}
