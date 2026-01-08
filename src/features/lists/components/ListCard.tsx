import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Archive, FolderInput } from "lucide-react";
import { ListCard as ListCardType } from "../types";
import { ItemCard, ItemCardContent, ItemCardActionButton } from "@/components/ui/ItemCard";

interface ListCardProps {
  card: ListCardType;
  onEditStart: (id: string) => void;
  onArchive: (id: string) => void;
}

export function ListCard({ card, onEditStart, onArchive }: ListCardProps) {
  const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
    id: card.id,
    data: {
      type: "Card",
      card,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  return (
    <ItemCard
      ref={setNodeRef}
      style={style}
      isDragging={isDragging}
      onClick={() => onEditStart(card.id)}
      {...attributes}
      {...listeners}
      actions={
        <>
          <ItemCardActionButton
            variant="info"
            title="Move to..."
            onClick={(e) => {
              e.stopPropagation();
              // Implement move logic later or pass a handler
            }}
          >
            <FolderInput size={18} />
          </ItemCardActionButton>
          <ItemCardActionButton
            variant="danger"
            title="Archive"
            onClick={(e) => {
              e.stopPropagation();
              onArchive(card.id);
            }}
          >
            <Archive size={18} />
          </ItemCardActionButton>
        </>
      }
    >
      <ItemCardContent>
        {card.content}
      </ItemCardContent>
    </ItemCard>
  );
}
