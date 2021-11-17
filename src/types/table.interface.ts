export interface ITableProps {
  rows: { id: string; [propertyName: string]: any; actions?: any }[];
  columns: ITableColumn[];
  hasTotal?: boolean;
  totalKey?: string;
}

export interface ITableColumn {
  label: string;
  key: string;
  editable?: boolean;
  hasCount?: boolean;
  isAction?: boolean;
}
