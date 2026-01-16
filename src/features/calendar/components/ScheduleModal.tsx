
import { createPortal } from "react-dom";
import { X, Archive, Save } from "lucide-react";
import { GlassPanel } from "@/components/ui/GlassPanel";
import { useState, useEffect } from "react";

interface ScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialDate?: Date;
}

export function ScheduleModal({ isOpen, onClose, initialDate }: ScheduleModalProps) {
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (initialDate) {
      const dateStr = initialDate.toISOString().split("T")[0];
      setStartDate(dateStr);
      setEndDate(dateStr);
      setStartTime("09:00");
      setEndTime("10:00");
    }
  }, [initialDate, isOpen]);

  const handleSave = () => {
    console.log("Saving schedule:", {
      title,
      startDate,
      endDate,
      startTime,
      endTime,
      description,
    });
    onClose();
  };

  const handleArchive = () => {
    console.log("Archive feature coming soon");
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <GlassPanel className="w-full max-w-lg overflow-hidden border-white/20 shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <h2 className="text-lg font-bold text-white">New Schedule</h2>
          <button
            onClick={onClose}
            className="p-1 text-white/50 transition-colors rounded-md hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col gap-4 p-6">
          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold tracking-wide uppercase text-white/60">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Add title"
              className="w-full px-3 py-2 text-white placeholder-white/30 transition-all border rounded-md outline-none bg-white/5 border-white/10 focus:border-white/30 focus:bg-white/10"
            />
          </div>

          {/* Date & Time Grid */}
          <div className="flex flex-col gap-4">
            {/* Start */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold tracking-wide uppercase text-white/60">
                Start
              </label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-2 py-2 text-sm text-white transition-all border rounded-md outline-none bg-white/5 border-white/10 focus:border-white/30 focus:bg-white/10 scheme-dark"
                />
                <input
                  type="time"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-2 py-2 text-sm text-white transition-all border rounded-md outline-none bg-white/5 border-white/10 focus:border-white/30 focus:bg-white/10 scheme-dark"
                />
              </div>
            </div>

            {/* End */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold tracking-wide uppercase text-white/60">
                End
              </label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-2 py-2 text-sm text-white transition-all border rounded-md outline-none bg-white/5 border-white/10 focus:border-white/30 focus:bg-white/10 scheme-dark"
                />
                <input
                  type="time"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-2 py-2 text-sm text-white transition-all border rounded-md outline-none bg-white/5 border-white/10 focus:border-white/30 focus:bg-white/10 scheme-dark"
                />
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold tracking-wide uppercase text-white/60">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add description"
              rows={4}
              className="w-full px-3 py-2 text-white placeholder-white/30 transition-all border rounded-md outline-none bg-white/5 border-white/10 focus:border-white/30 focus:bg-white/10 resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-white/10 bg-white/5">
          <button
            onClick={handleArchive}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white/70 transition-colors rounded-md hover:text-white hover:bg-white/10"
          >
            <Archive className="w-4 h-4" />
            Archive
          </button>
          
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-white/70 transition-colors rounded-md hover:text-white hover:bg-white/10"
            >
              Close
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white shadow-lg transition-colors bg-blue-600 rounded-md hover:bg-blue-500"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
          </div>
        </div>
      </GlassPanel>
    </div>,
    document.body
  );
}
