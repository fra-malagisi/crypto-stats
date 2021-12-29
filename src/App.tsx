import React from 'react';
import Header from 'components/core/header';
import AddCrypto from 'pages/home/add-crypto';
import { ChartProps, DailyAmount, ITableProps } from 'types';
import { faunaDbApiCrypto, faunaDbApiDailyAmount } from 'services/fauna-db';
import { useEffect, useState } from 'react';
import { ICrypto } from 'types';
import { cryptoDetails } from 'facades/autocomplete';
import Table from 'components/shared/table';
import ArrayUtil from 'utils/array.util';
import { DeleteIcon, EditIcon } from 'icons';
import Button from 'components/shared/button/button.component';
import { populateCryptoValues } from 'utils';
import Modal from './components/shared/modal';
import UpdateCrypto from './pages/update-crypto';
import { BarChart, PieChart } from 'charts';
import { initialTableStructure } from './constants';
import { equals, prop, map, propOr, append, drop, forEach, complement, all, add, multiply, subtract, assoc, reduce } from 'ramda';
import coinGeckoApi from 'services/coin-gecko';

function App() {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [dailyAmounts, setdailyAmounts] = useState<DailyAmount[]>([]);
  const [cryptoToEdit, setCryptoToEdit] = useState<ICrypto | null>(null);
  const [pieChartProps, setPieChartProps] = useState<ChartProps>({ labels: [], colors: [], data: [] });
  const [tableProps, setTableProps] = useState<ITableProps>(initialTableStructure);

  useEffect(() => {
    getCryptoData();
  }, []);

  const checkDailyAmounts = async (allCrypto: ICrypto[]) => {
    const yesterday = new Date(new Date().setDate(new Date().getDate() - 1)).toLocaleDateString();
    if (equals(dailyAmounts.length, 0)) {
      const dailyAmounts = await faunaDbApiDailyAmount.getAllDailyAmounts();
      setdailyAmounts(drop(1, dailyAmounts));
      if (all(complement(equals(yesterday)), map(prop('dateLabel'), dailyAmounts))) {
        let yesterdayTotalAmount = 0;
        for (const crypto of allCrypto) {
          const price = await coinGeckoApi.getCryptoHistory(crypto.id, yesterday.split('/').join('-'));
          yesterdayTotalAmount = add(yesterdayTotalAmount)(multiply(price, crypto.qty));
        }
        const newDailyAmount: DailyAmount = {
          dateLabel: yesterday,
          amount: yesterdayTotalAmount,
          pnl: subtract(yesterdayTotalAmount, propOr(0, 'amount')(ArrayUtil.getLastElement<DailyAmount>(dailyAmounts))),
        };
        saveDailyAmount(newDailyAmount);
        setdailyAmounts(append(newDailyAmount, dailyAmounts));
      }
    }
  };

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
            <Button key="edit" icon={<EditIcon />} action={() => openModal(cryptoData)} />,
          ],
        }),
        cryptosData
      )
    )(tableProps);

  const getPieChartProps = (cryptosData: ICrypto[]) =>
    reduce(
      (acc, curr) => ({
        labels: append(curr.name, acc.labels),
        colors: append(curr.color || '', acc.colors),
        data: append(curr.myValue || 0, acc.data),
      }),
      { labels: [] as string[], colors: [] as string[], data: [] as number[] },
      cryptosData
    );

  const getCryptoData = async () => {
    const allCrypto: ICrypto[] = await faunaDbApiCrypto.getAllCoins();
    checkDailyAmounts(allCrypto);
    let cryptosData: ICrypto[] = [];
    forEach(async (crypto) => {
      let cryptoData = await cryptoDetails(crypto);
      cryptoData = populateCryptoValues(cryptoData);
      cryptosData = append(cryptoData, cryptosData);
      if (ArrayUtil.isLastElement(allCrypto.length, cryptosData.length)) {
        const totalAmount = reduce((acc, curr) => acc + (curr.myValue || 0), 0, cryptosData);
        cryptosData = map(
          (cryptoData) => assoc('percentage', `${(((cryptoData.myValue || 0) / totalAmount) * 100).toFixed(2)}`)(cryptoData),
          cryptosData
        );
        setPieChartProps(getPieChartProps(cryptosData));
        cryptosData.sort((a, b) => (b.myValue || 0) - (a.myValue || 0));
        setTableProps(updateTableRows(cryptosData));
      }
    }, allCrypto);
  };

  const saveDailyAmount = async (dailyAmount: DailyAmount) => await faunaDbApiDailyAmount.saveDailyAmounts(dailyAmount);

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

  const renderBarChart = (): JSX.Element => {
    const dailyAmountSum = dailyAmounts.reduce((acc, curr) => (acc = acc + (curr.pnl || 0)), 0);
    return (
      <BarChart
        data={dailyAmounts.map((dailyAmount) => dailyAmount.pnl || 0)}
        labels={dailyAmounts.map((dailyAmount) => dailyAmount.dateLabel)}
        title={`PNL (${dailyAmountSum > 0 ? '+' : ''} ${dailyAmountSum})`}
        titleColor={`${dailyAmountSum > 0 ? 'green' : 'red'}`}
      />
    );
  };

  return (
    <>
      <Header />
      <main className="px-4 pb-8 md:px-0 flex flex-col">
        <AddCrypto onCryptoAdded={onCryptoAdded} />
        <div className="flex flex-row mb-8">
          {tableProps.rows?.length > 0 && <Table {...tableProps} />}
          {pieChartProps.labels.length > 0 && (
            <PieChart labels={pieChartProps.labels} colors={pieChartProps.colors} data={pieChartProps.data} />
          )}
        </div>
        {dailyAmounts.length > 0 && renderBarChart()}
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
