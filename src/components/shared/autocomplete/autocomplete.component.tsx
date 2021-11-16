import { useEffect, useRef } from 'react';
import { IAutocompleteProps } from 'types';
import useAutocomplete from './use-autocomplete';

const Autocomplete = ({ id, label, placeholder, data, onChange, reset, returnText }: IAutocompleteProps): JSX.Element => {
  const {
    registerInputRef,
    showList,
    itemsFiltered,
    registerOptionsRef,
    currentElement,
    textFieldValue,
    onChangeTextFiledValue,
    onInputChange,
    onKeyDown,
    onBlur,
    onClickItem,
  } = useAutocomplete(data, onChange, id, returnText);

  const idLabel = `${id}-label`;
  const idListBox = `${id}-listbox`;

  const inputRef = useRef<HTMLInputElement>(null);
  const optionsRef = useRef<Array<HTMLLIElement | null>>([]);

  useEffect(() => {
    registerInputRef(inputRef);
  }, [inputRef]);

  useEffect(() => {
    registerOptionsRef(optionsRef);
  }, [optionsRef]);

  useEffect(() => {
    onChangeTextFiledValue('');
    onChange('');
  }, [reset]);

  return (
    <>
      <label className="block text-gray-700 text-sm font-bold mb-2" id={idLabel} htmlFor={id}>
        {label}
      </label>
      <input
        type="text"
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight border-transparent focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
        id={id}
        ref={inputRef}
        aria-labelledby={idLabel}
        aria-controls={idListBox}
        aria-autocomplete="list"
        placeholder={placeholder}
        onChange={(event) => onInputChange(event.target.value)}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        autoComplete="off"
        value={textFieldValue}
      ></input>
      <ul
        aria-labelledby={idLabel}
        role="listbox"
        id={idListBox}
        className={`mt-4 border rounded overflow-scroll ${showList ? '' : 'hidden'} max-h-48`}
      >
        {showList &&
          itemsFiltered.length > 0 &&
          itemsFiltered.map((item, i) => (
            <li
              id={`${id}-${item.id}`}
              data-value={item.id}
              key={item.id}
              role="option"
              ref={(el) => (optionsRef.current[i] = el)}
              onMouseDown={(event) => {
                onClickItem(i);
                event.preventDefault();
              }}
              className={`text-base p-4 ${
                currentElement === i ? 'bg-blue-400 font-bold text-white' : ''
              } hover:bg-blue-400 hover:text-white`}
            >
              {item.label}
            </li>
          ))}
      </ul>
    </>
  );
};

export default Autocomplete;
