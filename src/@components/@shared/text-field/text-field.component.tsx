import { ITextFieldProps } from '@components/@shared/text-field/text-field.interface';

const TextField = ({ label, id, placeholder, handleChange, type = 'text', ...otherProps }: ITextFieldProps): JSX.Element => {
  const idLabel = `${id}-label`;

  return (
    <>
      <label className="block text-gray-700 text-sm font-bold mb-2" id={idLabel} htmlFor={id}>
        {label}
      </label>
      <input
        type={type}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight border-transparent focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
        id={id}
        aria-labelledby={idLabel}
        placeholder={placeholder}
        onChange={handleChange}
        {...otherProps}
      ></input>
    </>
  );
};

export default TextField;
