interface CardHeaderProps {
  title: string;
  isCollapsed: boolean;
  onToggle: () => void;
  canExpand?: boolean;
}

export function CardHeader({ title, isCollapsed, onToggle, canExpand = true }: CardHeaderProps) {
  return (
    <div className="card-header" onClick={onToggle}>
      <span>{title}</span>
      {canExpand && <span className={`toggle ${isCollapsed ? 'collapsed' : ''}`}>▼</span>}
    </div>
  );
}
