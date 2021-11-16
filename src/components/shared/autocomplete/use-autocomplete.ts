import { useEffect, useState, KeyboardEvent } from 'react';
import { IAutocompleteData } from '../../../types';
import { keys } from 'utils';

type UseAutocompleteResult = {
  showList: boolean;
  registerInputRef: (inputRef: React.RefObject<HTMLInputElement>) => void;
  registerOptionsRef: (optionsRef: React.MutableRefObject<(HTMLLIElement | null)[]>) => void;
  itemsFiltered: IAutocompleteData[];
  currentElement: number;
  textFieldValue: string;
  onChangeTextFiledValue: (text: string) => void;
  onInputChange: (text: string) => void;
  onKeyDown: (event: KeyboardEvent<HTMLInputElement>) => void;
  onBlur: () => void;
  onClickItem: (index: number) => void;
};

const useAutocomplete = (
  data: IAutocompleteData[],
  callbackParent: (value: any) => void,
  id: string,
  returnText?: boolean
): UseAutocompleteResult => {
  const [showList, setShowList] = useState<boolean>(false);
  const [itemsFiltered, setItemsFiltered] = useState<IAutocompleteData[]>([]);
  const [hasElements, setHasElements] = useState<boolean>(false);
  const [inputRef, setInputRef] = useState<React.RefObject<HTMLInputElement> | null>(null);
  const [optionsRef, setOptionsRef] = useState<React.MutableRefObject<(HTMLLIElement | null)[]>>();
  const [currentElement, setCurrentElement] = useState<number>(0);
  const [textFieldValue, setTextFieldValue] = useState<string>('');

  useEffect(() => {
    setHasElements(itemsFiltered.length > 0);
    setShowList(itemsFiltered.length > 0);
    if (inputRef) {
      setAriaExpandedAttribute();
    }
  }, [itemsFiltered]);

  useEffect(() => {
    if (showList) {
      unselect();
      setCurrentElement(0);
      optionsRef?.current[0]?.setAttribute('aria-selected', 'true');
    }
  }, [showList]);

  const setAriaExpandedAttribute = () => {
    inputRef?.current?.setAttribute('aria-expanded', hasElements ? 'true' : 'false');
  };

  const registerInputRef = (inputRef: React.RefObject<HTMLInputElement>) => {
    setInputRef(inputRef);
  };

  const registerOptionsRef = (optionsRef: React.MutableRefObject<(HTMLLIElement | null)[]>) => {
    setOptionsRef(optionsRef);
  };

  const onFilterChange = (filter: string) => {
    setItemsFiltered([
      ...data.filter((item: { id: string; label: string }) => {
        return filter && item.label.toLowerCase().indexOf(filter.toLowerCase()) === 0;
      }),
    ]);
  };

  const unselect = () => {
    optionsRef?.current.forEach((option) => {
      if (option?.getAttribute('aria-selected')) {
        option?.removeAttribute('aria-selected');
      }
    });
  };

  const onChangeTextFiledValue = (text: string) => {
    setTextFieldValue(text);
  };

  const onSaveValue = (index?: number) => {
    const text = optionsRef?.current[index || currentElement]?.textContent || '';
    onChangeTextFiledValue(text);
    setShowList(false);
    inputRef?.current?.setAttribute('aria-activedescendant', '');
    const returnValue = optionsRef?.current[index || currentElement]?.dataset['value'] || '';
    callbackParent(!returnText ? returnValue : `${returnValue} : ${text}`);
  };

  const onInputChange = (text: string) => {
    callbackParent('');
    onChangeTextFiledValue(text);
    onFilterChange(text);
    setShowList(false);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.keyCode === keys.DOWN) {
      event.preventDefault();
      if (optionsRef?.current[currentElement + 1]) {
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
      if (optionsRef?.current[currentElement - 1]) {
        unselect();
        optionsRef.current[currentElement - 1]?.setAttribute('aria-selected', 'true');
        optionsRef.current[currentElement - 1]?.scrollIntoView(false);
        inputRef?.current?.setAttribute('aria-activedescendant', `${id}-${optionsRef.current[currentElement - 1]?.textContent}`);

        setCurrentElement(currentElement - 1);
      }
    } else if (event.keyCode === keys.ENTER) {
      event.preventDefault();
      onSaveValue();
    } else if (event.keyCode === keys.ESC) {
      event.preventDefault();
      setShowList(false);
      inputRef?.current?.setAttribute('aria-activedescendant', '');
      onChangeTextFiledValue('');
      callbackParent('');
      setCurrentElement(0);
    }
  };

  const onBlur = () => {
    setShowList(false);
  };

  const onClickItem = (index: number) => {
    onSaveValue(index);
  };

  return {
    showList,
    registerInputRef,
    itemsFiltered,
    registerOptionsRef,
    currentElement,
    textFieldValue,
    onChangeTextFiledValue,
    onInputChange,
    onKeyDown,
    onBlur,
    onClickItem,
  };
};

export default useAutocomplete;
