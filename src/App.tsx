import React from 'react';
import DailyPnlChart from './pages/home/daily-pnl-chart';
import Header from 'components/core/header';
import AddCrypto from 'pages/home/add-crypto';
import { faunaDbApiCrypto } from 'services/fauna-db';
import { useEffect, useState } from 'react';
import { ICrypto } from 'types';
import { cryptoDetails } from 'facades/autocomplete';
import ArrayUtil from 'utils/array.util';
import { populateCryptoValues } from 'utils';
import Modal from './components/shared/modal';
import UpdateCrypto from './pages/update-crypto';
import { map, propOr, append, forEach, assoc, reduce, sort } from 'ramda';
import CryptoTable from './pages/home/crypto-table';
import CryptoPieChart from './pages/home/crypto-pie-chart';

function App() {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [allCrypto, setAllCrypto] = useState<ICrypto[]>([]);
  const [cryptoToEdit, setCryptoToEdit] = useState<ICrypto | null>(null);

  useEffect(() => {
    getCryptoData();
  }, []);

  console.log(process.env, 'NODE');

  const getCryptoData = async () => {
    let allCrypto: ICrypto[];
    try {
      allCrypto = await faunaDbApiCrypto.getAllCoins();
    } catch (error: unknown) {
      console.error(error);
      allCrypto = [];
    }
    if (allCrypto.length > 0) {
      let cryptosData: ICrypto[] = [];
      forEach(async (crypto) => {
        let cryptoData: ICrypto | undefined;
        try {
          cryptoData = await cryptoDetails(crypto);
        } catch (error: unknown) {
          console.error(error);
        }
        if (cryptoData) {
          cryptoData = populateCryptoValues(cryptoData);
          cryptosData = append(cryptoData, cryptosData);
          if (ArrayUtil.isLastElement(allCrypto.length, cryptosData.length)) {
            const totalAmount = reduce((acc, curr) => acc + (propOr(0, 'myValue', curr) as number), 0, cryptosData);
            cryptosData = map(
              (cryptoData) =>
                assoc('percentage', `${(((propOr(0, 'myValue', cryptoData) as number) / totalAmount) * 100).toFixed(2)}`)(cryptoData),
              cryptosData
            );
            cryptosData = sort((a, b) => (propOr(0, 'myValue', b) as number) - (propOr(0, 'myValue', a) as number), cryptosData);
            setAllCrypto(cryptosData);
          }
        }
      }, allCrypto);
    }
  };

  const openModal = (crypto: ICrypto) => {
    setCryptoToEdit(crypto);
    setShowModal(true);
  };

  return (
    <>
      <Header />
      <main className="px-4 pb-8 md:px-0 flex flex-col">
        <AddCrypto onCryptoAdded={getCryptoData} />
        <div className="flex flex-row mb-8">
          {allCrypto.length > 0 && <CryptoTable allCrypto={allCrypto} handleDelete={getCryptoData} handleEdit={openModal} />}
          {allCrypto.length > 0 && <CryptoPieChart allCrypto={allCrypto} />}
        </div>
        {allCrypto.length > 0 && <DailyPnlChart allCrypto={allCrypto} />}
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
