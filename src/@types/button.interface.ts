import { FunctionComponent, SVGProps } from 'react';

export interface IButtonProps {
  label?: string;
  action?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
  icon?: any;
  color?: string;
}
