import { IButtonProps } from 'types';

const Button = ({ label, action, type = 'button', disabled, icon, color = 'blue', classes = '' }: IButtonProps): JSX.Element => {
  return (
    <button
      {...(action && { onClick: action })}
      type={type}
      disabled={disabled}
      className={`bg-${color}-500 hover:bg-${color}-700 text-white font-bold py-2 px-4 rounded-full active:bg-${color}-400 disabled:opacity-50 disabled:pointer-events-none disabled ${classes}`}
    >
      {icon && icon}
      {label && label}
    </button>
  );
};

export default Button;
