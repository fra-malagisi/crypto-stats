import Header from 'components/core/header';
import AddCrypto from 'pages/home/add-crypto';
import { ITableProps } from 'types';
import faunaDbApi from 'services/fauna-db/crypto.service';
import { useEffect, useState } from 'react';
import { ICrypto } from 'types';
import { cryptoDetails } from 'facades/autocomplete';
import { useExchangeRatio } from 'hooks';
import Table from 'components/shared/table';
import ArrayUtil from 'utils/array.util';
import { DeleteIcon, EditIcon } from 'icons';
import Button from 'components/shared/button/button.component';
import { getRandomColor, populateCryptoValues } from 'utils';
import Modal from './components/shared/modal';
import UpdateCrypto from './pages/update-crypto';
import PieChart from 'charts';

function App() {
  const exchangeRatio = useExchangeRatio('usd', 'eur');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [cryptoToEdit, setCryptoToEdit] = useState<ICrypto | null>(null);
  const [labels, setLabels] = useState<string[]>([]);
  const [data, setData] = useState<number[]>([]);
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
    const allCrypto: ICrypto[] = await faunaDbApi.getAllCoins();
    const cryptosData: ICrypto[] = [];
    for (const [i, crypto] of allCrypto.entries()) {
      let cryptoData = await cryptoDetails(crypto);
      cryptoData = populateCryptoValues(cryptoData, exchangeRatio);
      cryptosData.push(cryptoData);
      if (ArrayUtil.isLastElement(allCrypto.length, i)) {
        setLabels(cryptosData.map((crypto) => crypto.name));
        setData(cryptosData.map((crypto) => crypto.myValue || 0));
        cryptosData.sort((a, b) => (b.myValue || 0) - (a.myValue || 0));
        setTableProps({
          columns: [...tableProps.columns],
          rows: cryptosData.map((cryptoData) => ({
            ...cryptoData,
            actions: [
              <Button
                key="delete"
                icon={<DeleteIcon />}
                color="red"
                action={() => handleDeleteCrypto(cryptoData.ref || '')}
                classes="mr-4"
              />,
              <Button key="edit" icon={<EditIcon />} action={() => openModal(cryptoData)} />,
            ],
          })),
          hasTotal: tableProps.hasTotal,
          totalKey: tableProps.totalKey,
        });
      }
    }
  };

  const openModal = (crypto: ICrypto) => {
    setCryptoToEdit(crypto);
    setShowModal(true);
  };

  const handleDeleteCrypto = async (cryptoRef: string) => {
    await faunaDbApi.deleteCrypto(cryptoRef);
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
      <main className="px-4 pb-8 md:px-0 flex flex-col">
        <AddCrypto onCryptoAdded={onCryptoAdded} />
        <div className="flex flex-row">
          {tableProps.rows?.length > 0 && <Table {...tableProps} />}
          <PieChart labels={labels} colors={labels.map((_) => getRandomColor())} data={data} />
        </div>
      </main>
      <Modal
        title="Update crypto"
        show={showModal}
        onClose={() => setShowModal(false)}
        content={
          cryptoToEdit ? (
            <UpdateCrypto
              crypto={cryptoToEdit}
              action={() => {
                setShowModal(false);
                getCryptoData();
              }}
            />
          ) : (
            <></>
          )
        }
      />
    </>
  );
}

export default App;
