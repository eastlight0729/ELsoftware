interface MemoEditorProps {
  /** The current markdown content. */
  content: string;
  /** Callback to update the content. */
  onChange: (value: string) => void;
}

/**
 * A textarea-based markdown editor.
 * styling includes a mono-spaced font and transparent background for seamless integration.
 */
export function MemoEditor({ content, onChange }: MemoEditorProps) {
  return (
    <textarea
      className="w-full h-full p-6 resize-none bg-transparent outline-none text-neutral-800 dark:text-neutral-200 font-mono text-sm leading-relaxed placeholder:text-neutral-400 focus:bg-neutral-50/50 dark:focus:bg-neutral-800/50 transition-colors"
      value={content}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Type your markdown here..."
      spellCheck={false}
    />
  );
}
