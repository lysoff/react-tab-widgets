export type Widget = string;

export type Position = 'left' | 'right' | 'top' | 'bottom' | 'center';

export type Container = {
  isVertical: boolean;
  width?: number;
  height?: number;
  containers?: string[];
  widgets?: Widget[];
};
