import { ChangeEvent, KeyboardEvent, useEffect, useRef, useState } from 'react';
import { IAutocompleteData, IAutocompleteProps } from '@types';
import { keys } from '@utils';

const Autocomplete = ({ id, label, placeholder, data, onChange, reset, returnText }: IAutocompleteProps): JSX.Element => {
  const [showList, setShowList] = useState<boolean>(false);
  const [textFieldValue, setTextFieldValue] = useState<string>('');
  const [itemsFiltered, setItemsFiltered] = useState<IAutocompleteData[]>([]);
  const [currentElement, setCurrentElement] = useState<number>(0);

  const idLabel = `${id}-label`;
  const idListBox = `${id}-listbox`;

  const inputRef = useRef<HTMLInputElement>(null);
  const optionsRef = useRef<Array<HTMLLIElement | null>>([]);

  useEffect(() => {
    const hasElements = itemsFiltered.length > 0;
    setShowList(hasElements);
    inputRef?.current?.setAttribute('aria-expanded', hasElements ? 'true' : 'false');
  }, [itemsFiltered]);

  useEffect(() => {
    if (showList) {
      unselect();
      setCurrentElement(0);
      optionsRef.current[0]?.setAttribute('aria-selected', 'true');
    }
  }, [showList]);

  useEffect(() => {
    if (reset) {
      setTextFieldValue('');
      onChange('');
    }
  }, [reset]);

  const saveValue = (index?: number) => {
    const text = optionsRef.current[index || currentElement]?.textContent || '';
    setTextFieldValue(text);
    setShowList(false);
    inputRef?.current?.setAttribute('aria-activedescendant', '');
    const returnValue = optionsRef.current[index || currentElement]?.dataset['value'] || '';
    onChange(!returnText ? returnValue : `${returnValue} : ${text}`);
  };

  const unselect = () => {
    optionsRef.current.forEach((option) => {
      if (option?.getAttribute('aria-selected')) {
        option?.removeAttribute('aria-selected');
      }
    });
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    onChange('');
    setTextFieldValue(event.target.value);
    setItemsFiltered([
      ...data.filter((item: { id: string; label: string }) => {
        return event.target.value && item.label.toLowerCase().indexOf(event.target.value.toLowerCase()) === 0;
      }),
    ]);
    setShowList(false);
  };

  const handleKeyDownInput = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode === keys.DOWN) {
      event.preventDefault();
      if (optionsRef.current[currentElement + 1]) {
        unselect();
        optionsRef.current[currentElement + 1]?.setAttribute('aria-selected', 'true');
        if (currentElement + 1 > 4) {
          optionsRef.current[currentElement + 1]?.scrollIntoView(false);
        }
        inputRef?.current?.setAttribute('aria-activedescendant', `${id}-${optionsRef.current[currentElement + 1]?.textContent}`);
        setCurrentElement(currentElement + 1);
      }
    } else if (event.keyCode === keys.UP) {
      event.preventDefault();
      if (optionsRef.current[currentElement - 1]) {
        unselect();
        optionsRef.current[currentElement - 1]?.setAttribute('aria-selected', 'true');
        optionsRef.current[currentElement - 1]?.scrollIntoView(false);
        inputRef?.current?.setAttribute('aria-activedescendant', `${id}-${optionsRef.current[currentElement - 1]?.textContent}`);

        setCurrentElement(currentElement - 1);
      }
    } else if (event.keyCode === keys.ENTER) {
      saveValue();
    } else if (event.keyCode === keys.ESC) {
      event.preventDefault();
      setShowList(false);
      inputRef?.current?.setAttribute('aria-activedescendant', '');
      setTextFieldValue('');
      onChange('');
      setCurrentElement(0);
    }
  };

  const handleClickItem = (index: number) => {
    saveValue(index);
  };

  const handleBlur = () => {
    setShowList(false);
  };

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
        onChange={handleInputChange}
        onBlur={handleBlur}
        onKeyDown={(event) => handleKeyDownInput(event)}
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
                handleClickItem(i);
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
