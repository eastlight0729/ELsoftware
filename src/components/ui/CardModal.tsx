
import { createPortal } from "react-dom";
import { X, Archive, Save } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";

export interface CardModalData {
  id?: string;
  title: string;
  description: string;
  // List specific
  size?: string;
  // Calendar specific
  startDate?: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
}

interface CardModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Partial<CardModalData>;
  onSave: (data: CardModalData) => void;
  onArchive?: () => void;
}

const SIZES = [
  { value: "1", label: "1" },
  { value: "2", label: "2" },
  { value: "3", label: "3" },
  { value: "5", label: "5" },
  { value: "8", label: "8" },
];

export function CardModal({ 
  isOpen, 
  onClose, 
  initialData, 
  onSave, 
  onArchive, 
}: CardModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [size, setSize] = useState("1");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  useEffect(() => {
    if (isOpen) {
      setTitle(initialData?.title || "");
      setDescription(initialData?.description || "");
      setSize(initialData?.size || "1");
      setStartDate(initialData?.startDate || "");
      setEndDate(initialData?.endDate || initialData?.startDate || ""); // default end date to start date if not provided
      setStartTime(initialData?.startTime || "09:00");
      setEndTime(initialData?.endTime || "10:00");
    }
  }, [isOpen, initialData]);

  const handleSave = () => {
    onSave({
      id: initialData?.id,
      title,
      description,
      size,
      startDate,
      endDate,
      startTime,
      endTime,
    });
    onClose();
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg overflow-hidden bg-zinc-900 border border-zinc-800 shadow-xl rounded-xl animate-in zoom-in-95 duration-200"
        onKeyDown={(e) => {
          if (e.key === "Escape") onClose();
          if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleSave();
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
          <h2 className="text-lg font-semibold text-zinc-100">
            Edit Card
          </h2>
          <button
            onClick={onClose}
            className="p-1 text-zinc-400 transition-colors rounded-md hover:text-zinc-100 hover:bg-zinc-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-4 p-6">
          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium tracking-wide uppercase text-zinc-400">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Add title"
              autoFocus
              className="w-full px-3 py-2 text-zinc-100 placeholder-zinc-500 transition-all border rounded-md outline-none bg-zinc-800 border-zinc-700 focus:border-zinc-600 focus:bg-zinc-800"
            />
          </div>

          {/* Size Selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium tracking-wide uppercase text-zinc-400">
              Size
            </label>
            <div className="flex space-x-1">
              {SIZES.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setSize(s.value)}
                  className={cn(
                    "w-8 h-8 rounded-md text-xs font-medium transition-all duration-200 border",
                    size === s.value
                      ? "bg-blue-600 border-blue-600 text-white shadow-sm"
                      : "bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200"
                  )}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Date & Time Grid */}
          <div className="flex flex-col gap-4">
            {/* Start */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium tracking-wide uppercase text-zinc-400">
                Start
              </label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-2 py-2 text-sm text-zinc-100 transition-all border rounded-md outline-none bg-zinc-800 border-zinc-700 focus:border-zinc-600 focus:bg-zinc-800 scheme-dark"
                />
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-2 py-2 text-sm text-zinc-100 transition-all border rounded-md outline-none bg-zinc-800 border-zinc-700 focus:border-zinc-600 focus:bg-zinc-800 scheme-dark"
                />
              </div>
            </div>

            {/* End */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-medium tracking-wide uppercase text-zinc-400">
                End
              </label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-2 py-2 text-sm text-zinc-100 transition-all border rounded-md outline-none bg-zinc-800 border-zinc-700 focus:border-zinc-600 focus:bg-zinc-800 scheme-dark"
                />
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-2 py-2 text-sm text-zinc-100 transition-all border rounded-md outline-none bg-zinc-800 border-zinc-700 focus:border-zinc-600 focus:bg-zinc-800 scheme-dark"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium tracking-wide uppercase text-zinc-400">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add description"
              rows={6}
              className="w-full px-3 py-2 text-zinc-100 placeholder-zinc-500 transition-all border rounded-md outline-none bg-zinc-800 border-zinc-700 focus:border-zinc-600 focus:bg-zinc-800 resize-none text-sm"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-zinc-800 bg-zinc-900">
          <button
            onClick={onArchive}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-zinc-400 transition-colors rounded-md hover:text-red-400 hover:bg-zinc-800"
          >
            <Archive className="w-4 h-4" />
            Archive
          </button>
          
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-zinc-400 transition-colors rounded-md hover:text-zinc-100 hover:bg-zinc-800"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!title.trim()}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors bg-blue-600 rounded-md hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
