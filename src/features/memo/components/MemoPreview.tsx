import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface MemoPreviewProps {
  /** The markdown content to render. */
  content: string;
}

/**
 * Renders the markdown content nicely using Tailwind typography.
 * Supports GFM (GitHub Flavored Markdown) via `remark-gfm`.
 */
export function MemoPreview({ content }: MemoPreviewProps) {
  return (
    <div className="w-full h-full p-6 overflow-y-auto bg-neutral-50/30 dark:bg-neutral-900/30">
      <article className="prose prose-sm md:prose-base prose-neutral dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-blue-600 dark:prose-a:text-blue-400 hover:prose-a:underline">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
      </article>
    </div>
  );
}
