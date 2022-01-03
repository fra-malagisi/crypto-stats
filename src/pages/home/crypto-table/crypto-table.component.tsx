import React, { useEffect, useState } from 'react';
import { ICrypto, ITableProps } from '../../../types';
import { initialTableStructure } from '../../../constants';
import Table from '../../../components/shared/table';
import { assoc, map, filter } from 'ramda';
import Button from '../../../components/shared/button/button.component';
import { DeleteIcon, EditIcon } from '../../../icons';
import { faunaDbApiCrypto } from '../../../services/fauna-db';

export type CryptoTableProps = {
  allCrypto: ICrypto[];
  handleEdit: (crypto: ICrypto) => void;
  handleDelete: () => void;
};

const CryptoTable = ({ allCrypto, handleEdit, handleDelete }: CryptoTableProps): JSX.Element => {
  const [tableProps, setTableProps] = useState<ITableProps>(initialTableStructure);

  useEffect(() => setTableProps(updateTableRows(allCrypto)), [allCrypto]);

  const updateTableRows = (cryptosData: ICrypto[]) =>
    assoc(
      'rows',
      map(
        (cryptoData: ICrypto) => ({
          ...cryptoData,
          actions: [
            <Button
              key="delete"
              icon={<DeleteIcon />}
              color="red"
              action={() => handleDeleteCrypto(cryptoData.ref || '')}
              classes="mr-4"
            />,
            <Button key="edit" icon={<EditIcon />} action={() => handleEdit(cryptoData)} />,
          ],
        }),
        cryptosData
      )
    )(tableProps);

  const handleDeleteCrypto = async (cryptoRef: string) => {
    try {
      await faunaDbApiCrypto.deleteCrypto(cryptoRef);
      setTableProps(
        assoc(
          'rows',
          filter((row) => {
            return row.ref !== cryptoRef;
          }, tableProps.rows)
        )(tableProps)
      );
      handleDelete();
    } catch (error: unknown) {
      console.error(error);
    }
  };

  return <>{tableProps.rows?.length > 0 && <Table {...tableProps} />}</>;
};

export default CryptoTable;
