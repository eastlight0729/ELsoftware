import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function Memo() {
  const [content, setContent] = useState<string>(() => {
    try {
      return localStorage.getItem("memo-content") || "# My Memo\n\nStart writing...";
    } catch {
      return "# My Memo\n\nStart writing...";
    }
  });

  useEffect(() => {
    localStorage.setItem("memo-content", content);
  }, [content]);

  return (
    <div className="w-full h-[75vh] bg-white dark:bg-neutral-900 rounded-3xl shadow-sm border border-neutral-200 dark:border-neutral-800 flex overflow-hidden">
      {/* Editor Section */}
      <div className="w-1/2 h-full flex flex-col border-r border-neutral-200 dark:border-neutral-800">
        <div className="px-6 py-4 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between">
          <h3 className="font-semibold text-neutral-700 dark:text-neutral-200">Editor</h3>
          <span className="text-xs text-neutral-400 font-medium">Markdown Supported</span>
        </div>
        <textarea
          className="flex-1 w-full h-full p-6 resize-none bg-transparent outline-none text-neutral-800 dark:text-neutral-200 font-mono text-sm leading-relaxed placeholder:text-neutral-400 focus:bg-neutral-50/50 dark:focus:bg-neutral-800/50 transition-colors"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Type your markdown here..."
          spellCheck={false}
        />
      </div>

      {/* Preview Section */}
      <div className="w-1/2 h-full flex flex-col bg-neutral-50/30 dark:bg-neutral-900/30">
        <div className="px-6 py-4 bg-neutral-50/30 dark:bg-neutral-900/30 border-b border-neutral-200 dark:border-neutral-800">
          <h3 className="font-semibold text-neutral-700 dark:text-neutral-200">Preview</h3>
        </div>
        <div className="flex-1 w-full p-6 overflow-y-auto">
          <article className="prose prose-sm md:prose-base prose-neutral dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-blue-600 dark:prose-a:text-blue-400 hover:prose-a:underline">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </article>
        </div>
      </div>
    </div>
  );
}
