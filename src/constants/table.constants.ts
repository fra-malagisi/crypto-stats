import { ITableProps } from 'types';

export const initialTableStructure: ITableProps = {
  rows: [],
  columns: [
    {
      label: 'Name',
      key: 'name',
    },
    {
      label: 'Value',
      key: 'valueFormatted',
    },
    {
      label: 'Qty',
      key: 'qty',
      editable: true,
    },
    {
      label: 'Wallet Value',
      key: 'myValueFormatted',
    },
    {
      label: 'Actions',
      key: 'actions',
    },
    {
      label: '%',
      key: 'percentage',
    },
  ],
  hasTotal: true,
  totalKey: 'myValue',
};
