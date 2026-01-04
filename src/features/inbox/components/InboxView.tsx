import { useState } from "react";
import { Plus } from "lucide-react";
import { useInboxItems, useCreateInboxItem } from "../hooks/useInbox";
import { InboxItem } from "./InboxItem";

// Extract Logic to a Custom Hook (View Model)
const useInboxViewModel = () => {
  const { data: items, isLoading } = useInboxItems();
  const { mutate: createItem } = useCreateInboxItem();
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    createItem(inputValue.trim());
    setInputValue("");
  };

  return {
    items,
    isLoading,
    inputValue,
    setInputValue,
    handleSubmit,
  };
};

export const InboxView = () => {
  const { items, isLoading, inputValue, setInputValue, handleSubmit } = useInboxViewModel();

  return (
    <div className="w-full max-w-2xl mx-auto h-full flex flex-col">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-md">Inbox</h1>
        <p className="text-white/80 font-medium">Capture your thoughts and tasks.</p>
      </header>

      <form onSubmit={handleSubmit} className="relative mb-8">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Add a new item..."
          className="w-full p-4 pl-5 pr-12 bg-white/20 backdrop-blur-xl border border-white/30 rounded-2xl shadow-sm outline-none focus:ring-2 focus:ring-white/50 transition-all text-lg text-white placeholder:text-white/60"
          autoFocus
          maxLength={500}
        />
        <button
          type="submit"
          disabled={!inputValue.trim()}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-white/20 hover:bg-white/30 text-white rounded-xl disabled:opacity-30 disabled:cursor-not-allowed hover:scale-105 transition-all border border-white/20"
        >
          <Plus size={20} />
        </button>
      </form>

      <div className="flex-1 overflow-y-auto pr-2 space-y-2">
        {isLoading ? (
          <div className="flex flex-col gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 bg-white/20 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : items?.length === 0 ? (
          <div className="text-center py-20 text-white/60">
            <p>Your inbox is empty.</p>
          </div>
        ) : (
          items?.map((item) => <InboxItem key={item.id} item={item} />)
        )}
      </div>
    </div>
  );
};
