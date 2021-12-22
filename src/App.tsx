import React from 'react';
import Header from 'components/core/header';
import AddCrypto from 'pages/home/add-crypto';
import { ChartProps, DailyAmount, ITableProps } from 'types';
import { faunaDbApiCrypto, faunaDbApiDailyAmount } from 'services/fauna-db';
import { useEffect, useState } from 'react';
import { ICrypto } from 'types';
import { cryptoDetails } from 'facades/autocomplete';
import { useExchangeRatio } from 'hooks';
import Table from 'components/shared/table';
import ArrayUtil from 'utils/array.util';
import { DeleteIcon, EditIcon } from 'icons';
import Button from 'components/shared/button/button.component';
import { populateCryptoValues } from 'utils';
import Modal from './components/shared/modal';
import UpdateCrypto from './pages/update-crypto';
import { BarChart, PieChart } from 'charts';

function App() {
  const exchangeRatio = useExchangeRatio('usd', 'eur');
  const [showModal, setShowModal] = useState<boolean>(false);
  const [dailyAmounts, setdailyAmounts] = useState<DailyAmount[]>([]);
  const [cryptoToEdit, setCryptoToEdit] = useState<ICrypto | null>(null);
  const [chartProps, setChartProps] = useState<ChartProps>({ labels: [], colors: [], data: [] });
  const [totalValue, setTotalValue] = useState<number>(0);
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
      {
        label: '%',
        key: 'percentage',
      },
    ],
    hasTotal: true,
    totalKey: 'myValue',
  });

  useEffect(() => {
    const today = new Date().toLocaleDateString();
    if (dailyAmounts.length > 0 && totalValue && !dailyAmounts.some((dailyAmount) => dailyAmount.date === today)) {
      saveDailyAmout({ date: today, amount: totalValue, pnl: totalValue - (ArrayUtil.getLastElement<DailyAmount>(dailyAmounts).pnl || 0) });
    }
  }, [dailyAmounts, totalValue]);

  useEffect(() => {
    const getDailyAmounts = async () => {
      const dailyAmounts = await faunaDbApiDailyAmount.getAllDailyAmounts();
      setdailyAmounts(dailyAmounts.slice(1));
    };
    getDailyAmounts();
  }, []);

  useEffect(() => {
    if (exchangeRatio > 0) {
      getCryptoData();
    }
  }, [exchangeRatio]);

  const getCryptoData = async () => {
    const allCrypto: ICrypto[] = await faunaDbApiCrypto.getAllCoins();
    const cryptosData: ICrypto[] = [];
    for (const [i, crypto] of allCrypto.entries()) {
      let cryptoData = await cryptoDetails(crypto);
      cryptoData = populateCryptoValues(cryptoData, exchangeRatio);
      cryptosData.push(cryptoData);
      if (ArrayUtil.isLastElement(allCrypto.length, i)) {
        const totalAmount = cryptosData.reduce((acc, curr) => acc + (curr.myValue || 0), 0);
        setTotalValue(totalAmount);
        cryptosData.forEach((crypto) => (crypto.percentage = `${(((crypto.myValue || 0) / totalAmount) * 100).toFixed(2)}`));
        setChartProps({
          labels: cryptosData.map((crypto) => crypto.name),
          colors: cryptosData.map((crypto) => crypto.color || ''),
          data: cryptosData.map((crypto) => crypto.myValue || 0),
        });
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

  const saveDailyAmout = async (dailyAmount: DailyAmount) => await faunaDbApiDailyAmount.saveDailyAmounts(dailyAmount);

  const openModal = (crypto: ICrypto) => {
    setCryptoToEdit(crypto);
    setShowModal(true);
  };

  const handleDeleteCrypto = async (cryptoRef: string) => {
    await faunaDbApiCrypto.deleteCrypto(cryptoRef);
    setTableProps({
      columns: [...tableProps.columns],
      rows: tableProps.rows.filter((row) => {
        return row.ref !== cryptoRef;
      }),
      hasTotal: tableProps.hasTotal,
      totalKey: tableProps.totalKey,
    });
    getCryptoData();
  };

  const onCryptoAdded = () => {
    getCryptoData();
  };

  return (
    <>
      <Header />
      <main className="px-4 pb-8 md:px-0 flex flex-col">
        <AddCrypto onCryptoAdded={onCryptoAdded} />
        <div className="flex flex-row mb-8">
          {tableProps.rows?.length > 0 && <Table {...tableProps} />}
          {chartProps.labels.length > 0 && <PieChart labels={chartProps.labels} colors={chartProps.colors} data={chartProps.data} />}
        </div>
        {dailyAmounts && (
          <BarChart
            data={dailyAmounts.map((dailyAmount) => dailyAmount.pnl || 0)}
            labels={dailyAmounts.map((dailyAmount) => dailyAmount.date)}
          />
        )}
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

export default React.memo(App);
