import { Plus } from "lucide-react";
import { useInboxViewModel } from "../hooks/useInboxViewModel";
import { InboxItem } from "./InboxItem";
import { ArchiveListModal } from "./ArchiveListModal";
import { UndoNotification } from "@/components/ui/UndoNotification";
import { FeatureHeader } from "@/components/ui/FeatureHeader";
import { ArchiveButton } from "@/components/ui/ArchiveButton";

export const InboxView = () => {
  const {
    items,
    isLoading,
    inputValue,
    setInputValue,
    handleSubmit,
    handleArchive,
    handleUndoArchive,
    handleCloseNotification,
    notificationState,
    isArchiveListOpen,
    setIsArchiveListOpen,
  } = useInboxViewModel();

  return (
    <div className="w-full max-w-2xl mx-auto h-full flex flex-col relative pt-4 pb-32 px-4">
      <FeatureHeader
        title="Inbox"
        subtitle="Capture your thoughts and tasks."
        action={<ArchiveButton onClick={() => setIsArchiveListOpen(true)} />}
      />

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

      <div className="flex-1 overflow-y-auto space-y-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
        {isLoading ? (
          <div className="flex flex-col gap-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-14 bg-white/20 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : items?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
             <div className="p-8 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg">
                <p className="text-white/80 font-medium text-lg">Your inbox is empty.</p>
             </div>
          </div>
        ) : (
          items?.map((item) => <InboxItem key={item.id} item={item} onArchive={handleArchive} />)
        )}
      </div>

      <UndoNotification
        isOpen={notificationState.isOpen}
        onUndo={handleUndoArchive}
        onClose={handleCloseNotification}
        message="Item archived"
      />

      <ArchiveListModal
        isOpen={isArchiveListOpen}
        onClose={() => setIsArchiveListOpen(false)}
      />
    </div>
  );
};
