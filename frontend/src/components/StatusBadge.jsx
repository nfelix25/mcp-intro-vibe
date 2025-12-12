import { Badge } from './ui/badge';

export function StatusBadge({ status }) {
  const statusConfig = {
    not_started: { label: 'Not Started', color: 'bg-gray-100 text-gray-800' },
    in_progress: { label: 'In Progress', color: 'bg-blue-100 text-blue-800' },
    done: { label: 'Done', color: 'bg-green-100 text-green-800' },
  };

  const config = statusConfig[status] || statusConfig.not_started;

  return (
    <Badge variant="secondary" className={config.color}>
      {config.label}
    </Badge>
  );
}
