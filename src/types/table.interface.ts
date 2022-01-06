export interface ITableProps {
  rows: { id: string; [propertyName: string]: any; actions?: JSX.Element[]; customStyle?: { column: string; style: string } }[];
  columns: ITableColumn[];
  hasTotal?: boolean;
  totalKey?: string;
}

export interface ITableColumn {
  label: string;
  key: string;
  editable?: boolean;
  hasCount?: boolean;
  customStyle?: string;
}
