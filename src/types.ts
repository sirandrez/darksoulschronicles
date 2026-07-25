export type EraKey = 'era_antiga' | 'ds1' | 'ds2' | 'ds3';

export interface EraInfo {
  key: EraKey;
  name: string;
  gameTitle: string;
  period: string;
  description: string;
  themeColor: string;
  glowColor: string;
}

export interface TimelineEvent {
  id: string;
  title: string;
  subtitle?: string;
  era: EraKey;
  eraLabel: string;
  yearOrOrder: number; // Order index for spatial layout on timeline
  timePeriodDisplay: string; // e.g. "O Início da Existência", "Era Primordial", "Primeiro Ciclo"
  shortDescription: string;
  fullLore: string;
  quote?: string;
  quoteAuthor?: string;
  location?: string;
  characters?: string[];
  imageUrl?: string;
  imageCaption?: string;
  isUserCreated?: boolean;
  tags?: string[];
  importance?: 'major' | 'normal' | 'pivotal';
}

export type LayoutViewMode = 'horizontal' | 'vertical';
