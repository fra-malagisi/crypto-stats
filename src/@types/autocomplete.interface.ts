export interface IAutocompleteProps {
  id: string;
  label: string;
  placeholder?: string;
  data: IAutocompleteData[];
  reset?: boolean;
  returnText?: boolean;
  onChange: (value: any) => void;
}

export interface IAutocompleteData {
  id: string;
  label: string;
}
