interface CardHeaderProps {
  title: string;
  isCollapsed: boolean;
  onToggle: () => void;
}

export function CardHeader({ title, isCollapsed, onToggle }: CardHeaderProps) {
  return (
    <div className="card-header" onClick={onToggle}>
      <span>{title}</span>
      <span className={`toggle ${isCollapsed ? 'collapsed' : ''}`}>▼</span>
    </div>
  );
}
