import { ReactNode } from 'react';

interface CardWrapperProps {
  cardClass: string;
  isCollapsed?: boolean;
  children: ReactNode;
}

export function CardWrapper({ cardClass, isCollapsed = false, children }: CardWrapperProps) {
  return (
    <div className={`node ${isCollapsed ? 'collapsed' : ''}`}>
      <div className={`card ${cardClass}`}>
        {children}
      </div>
    </div>
  );
}
