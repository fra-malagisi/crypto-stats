import { ChangeEvent, HTMLInputTypeAttribute } from 'react';

export interface ITextFieldProps {
  id?: string;
  label?: string;
  placeholder?: string;
  type?: HTMLInputTypeAttribute;
  value?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
}
