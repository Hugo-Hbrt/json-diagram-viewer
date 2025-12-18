import { ReactNode } from 'react';

interface CardWrapperProps {
  cardClass: string;
  isCollapsed?: boolean;
  children: ReactNode;
  afterCard?: ReactNode;
}

export function CardWrapper({ cardClass, isCollapsed = false, children, afterCard }: CardWrapperProps) {
  return (
    <div className={`node ${isCollapsed ? 'collapsed' : ''}`}>
      <div className={`card ${cardClass}`}>
        {children}
      </div>
      {afterCard}
    </div>
  );
}
