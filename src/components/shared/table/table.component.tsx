import { ITableColumn, ITableProps } from 'types';
import { currencyFormat } from 'utils/currency.util';

const Table = ({ rows, columns, hasTotal, totalKey }: ITableProps): JSX.Element => {
  return (
    <table className="table-auto border-collapse border border-gray-300 shadow-md">
      <thead>
        <tr>
          {columns.map((column: ITableColumn) => (
            <th className="border-l border-b p-4" key={column.key}>
              {column.label}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr key={row.id}>
            {columns.map((column) => (
              <td className="p-4 border-l border-b" key={row.id + column.key}>
                {Array.isArray(row[column.key]) ? row[column.key][0] : row[column.key]}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
      {hasTotal && (
        <tfoot>
          <tr>
            <th id="total" colSpan={columns.length - 2}>
              Total :
            </th>
            <td>
              {currencyFormat(
                rows.map((row) => row[totalKey || '']).reduce((acc: number, curr: number) => (acc = acc + curr), 0),
                '€'
              )}
            </td>
          </tr>
        </tfoot>
      )}
    </table>
  );
};

export default Table;
