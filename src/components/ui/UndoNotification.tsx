import { motion, AnimatePresence } from "framer-motion";
import { Undo2 } from "lucide-react";
import { useEffect } from "react";

interface UndoNotificationProps {
  isOpen: boolean;
  message?: string;
  onUndo: () => void;
  onClose: () => void;
}

export const UndoNotification = ({ 
  isOpen, 
  message = "Item archived", 
  onUndo, 
  onClose 
}: UndoNotificationProps) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: 100, opacity: 0, x: "-50%" }}
          animate={{ y: 0, opacity: 1, x: "-50%" }}
          exit={{ y: 100, opacity: 0, x: "-50%" }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="fixed bottom-24 left-1/2 flex items-center gap-4 px-6 py-3 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-xl z-50 min-w-[300px]"
        >
          <span className="text-white text-sm font-medium">{message}</span>
          <div className="flex-1" />
          <button
            onClick={onUndo}
            className="flex items-center gap-2 text-white hover:text-white/80 font-medium text-sm transition-colors cursor-pointer"
          >
            <Undo2 size={16} />
            Undo
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
