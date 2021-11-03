import Header from '@components/@core/header/header.component';
import AddCrypto from '@pages/home/add-crypto/add-crypto.component';
import { ITableProps } from '@components/@shared/table/table.interface';
import { deleteCrypto, getAllCoins } from '@services/fauna-db/crypto.service';
import { useEffect, useState } from 'react';
import { ICrypto } from '@models/crypto.models';
import { cryptoDetails } from '@facades/autocomplete/crypto.facade';
import { useExchangeRatio } from '@hooks/useExchangeRatio.hook';
import { currencyFormat } from '@utils/currency.util';
import Table from '@components/@shared/table/table.component';
import ArrayUtil from '@utils/array.util';
import { ReactComponent as DeleteIcon } from '@/assets/images/delete-icon.svg';
import Button from '@components/@shared/button/button.component';

function App() {
  const exchangeRatio = useExchangeRatio('usd', 'eur');
  const [tableProps, setTableProps] = useState<ITableProps>({
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
      },
      {
        label: 'Wallet Value',
        key: 'myValueFormatted',
      },
      {
        label: 'Actions',
        key: 'actions',
      },
    ],
    hasTotal: true,
    totalKey: 'myValue',
  });

  useEffect(() => {
    if (exchangeRatio > 0) {
      getCryptoData();
    }
  }, [exchangeRatio]);

  const getCryptoData = async () => {
    const allCrypto: ICrypto[] = await getAllCoins();
    const cryptosData: ICrypto[] = [];
    for (const [i, crypto] of allCrypto.entries()) {
      const cryptoData = await cryptoDetails(crypto);
      cryptoData.value = +((cryptoData.value || 0) * exchangeRatio).toFixed(3);
      cryptoData.myValue = +((cryptoData.value || 0) * cryptoData.qty).toFixed(3);
      cryptoData.myValueFormatted = currencyFormat(cryptoData.myValue || 0, '€');
      cryptoData.valueFormatted = currencyFormat(cryptoData.value || 0, '€');
      cryptosData.push(cryptoData);
      if (ArrayUtil.isLastElement(allCrypto.length, i)) {
        cryptosData.sort((a, b) => (b.myValue || 0) - (a.myValue || 0));
        setTableProps({
          columns: [...tableProps.columns],
          rows: cryptosData.map((cryptoData) => ({
            ...cryptoData,
            actions: [<Button key="delete" icon={<DeleteIcon />} color="red" action={() => handleDeleteCrypto(cryptoData.ref || '')} />],
          })),
          hasTotal: tableProps.hasTotal,
          totalKey: tableProps.totalKey,
        });
      }
    }
  };

  const handleDeleteCrypto = async (cryptoRef: string) => {
    await deleteCrypto(cryptoRef);
    setTableProps({
      columns: [...tableProps.columns],
      rows: tableProps.rows.filter((row) => {
        console.log(row.ref, cryptoRef);
        return row.ref !== cryptoRef;
      }),
      hasTotal: tableProps.hasTotal,
      totalKey: tableProps.totalKey,
    });
  };

  const onCryptoAdded = () => {
    getCryptoData();
  };

  return (
    <>
      <Header />
      <main className="px-4 pb-8 md:px-0">
        <AddCrypto onCryptoAdded={onCryptoAdded} />
        <br />
        {tableProps.rows?.length > 0 && <Table {...tableProps} />}
      </main>
    </>
  );
}

export default App;
