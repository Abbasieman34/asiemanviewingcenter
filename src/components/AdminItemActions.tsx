import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AdminItemActionsProps {
  onEdit: () => void;
  onDelete: () => void;
}

const AdminItemActions = ({ onEdit, onDelete }: AdminItemActionsProps) => {
  return (
    <div className="flex gap-2 flex-shrink-0">
      <Button size="icon" variant="ghost" onClick={onEdit}>
        <Pencil className="h-4 w-4" />
      </Button>
      <Button size="icon" variant="ghost" className="text-destructive" onClick={onDelete}>
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};

export default AdminItemActions;
