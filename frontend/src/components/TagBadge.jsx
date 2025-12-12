import { Badge } from './ui/badge';
import { X } from 'lucide-react';

export function TagBadge({ tag, onRemove }) {
  return (
    <Badge
      variant="outline"
      style={{
        backgroundColor: tag.color + '20',
        borderColor: tag.color,
        color: tag.color,
      }}
      className="gap-1"
    >
      {tag.name}
      {onRemove && (
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onRemove(tag.id);
          }}
          className="ml-1 hover:bg-black/10 rounded-full p-0.5"
        >
          <X className="h-3 w-3" />
        </button>
      )}
    </Badge>
  );
}
