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
      label: '%',
      key: 'percentage',
    },
    {
      label: '24h',
      key: 'price24Change',
    },
    {
      label: 'Actions',
      key: 'actions',
    },
  ],
  hasTotal: true,
  totalKey: 'myValue',
};
