import { useState } from "react";
import { Plus } from "lucide-react";
import { useInboxItems, useCreateInboxItem } from "../hooks/useInbox";
import { InboxItem } from "./InboxItem";

export const InboxView = () => {
  const { data: items, isLoading } = useInboxItems();
  const { mutate: createItem } = useCreateInboxItem();
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    createItem(inputValue.trim());
    setInputValue("");
  };

  return (
    <div className="w-full max-w-2xl mx-auto h-full flex flex-col">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-800 dark:text-white mb-2">Inbox</h1>
        <p className="text-neutral-500 dark:text-neutral-400">Capture your thoughts and tasks.</p>
      </header>

      <form onSubmit={handleSubmit} className="relative mb-8">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Add a new item..."
          className="w-full p-4 pl-5 pr-12 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-neutral-400 dark:focus:ring-neutral-600 transition-all text-lg placeholder:text-neutral-400"
          autoFocus
        />
        <button
          type="submit"
          disabled={!inputValue.trim()}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform"
        >
          <Plus size={20} />
        </button>
      </form>

      <div className="flex-1 overflow-y-auto pr-2 space-y-2">
        {isLoading ? (
          <div className="flex flex-col gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 bg-neutral-200 dark:bg-neutral-800 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : items?.length === 0 ? (
          <div className="text-center py-20 text-neutral-400">
            <p>Your inbox is empty.</p>
          </div>
        ) : (
          items?.map((item) => <InboxItem key={item.id} item={item} />)
        )}
      </div>
    </div>
  );
};
