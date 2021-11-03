import { ChangeEvent, HTMLInputTypeAttribute } from 'react';

export interface ITextFieldProps {
  id: string;
  label: string;
  placeholder?: string;
  type?: HTMLInputTypeAttribute;
  value: string;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
}
