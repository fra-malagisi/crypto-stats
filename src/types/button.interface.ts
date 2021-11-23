export interface IButtonProps {
  label?: string;
  action?: () => void;
  type?: 'button' | 'submit';
  disabled?: boolean;
  icon?: JSX.Element;
  color?: string;
  classes?: string;
}
