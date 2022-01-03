import React, { useEffect, useState } from 'react';
import { BarChart } from '../../../charts';
import { add, all, append, complement, drop, equals, map, multiply, prop, propOr, subtract } from 'ramda';
import { DailyAmount, ICrypto } from '../../../types';
import { getLastDayOfLastMonth, getYesterday } from '../../../utils/date.util';
import { faunaDbApiDailyAmount } from '../../../services/fauna-db';
import coinGeckoApi from '../../../services/coin-gecko';
import ArrayUtil from '../../../utils/array.util';

export type DailyPnlChartProps = {
  allCrypto: ICrypto[];
};

const DailyPnlChart = ({ allCrypto }: DailyPnlChartProps): JSX.Element => {
  const [dailyAmounts, setDailyAmounts] = useState<DailyAmount[]>([]);

  useEffect(() => {
    const checkDailyAmounts = async () => {
      const yesterday = new Date().getDate() !== 1 ? getYesterday().toLocaleDateString() : getLastDayOfLastMonth().toLocaleDateString();
      let dailyAmountsFromService: DailyAmount[];
      if (equals(dailyAmounts.length, 0)) {
        try {
          dailyAmountsFromService = await faunaDbApiDailyAmount.getAllDailyAmounts();
        } catch (error: unknown) {
          console.error(error);
          dailyAmountsFromService = [];
        }
        if (dailyAmountsFromService.length > 0) {
          setDailyAmounts(drop(1, dailyAmountsFromService));
          if (all(complement(equals(yesterday)), map(prop('dateLabel'), dailyAmountsFromService))) {
            let yesterdayTotalAmount = 0;
            let price: number;
            for (const crypto of allCrypto) {
              try {
                price = await coinGeckoApi.getCryptoHistory(crypto.id, yesterday.split('/').join('-'));
              } catch (error: unknown) {
                console.error(error);
                price = 0;
              }
              yesterdayTotalAmount = add(yesterdayTotalAmount)(multiply(price, crypto.qty));
            }
            const newDailyAmount: DailyAmount = {
              dateLabel: yesterday,
              amount: yesterdayTotalAmount,
              pnl: subtract(yesterdayTotalAmount, propOr(0, 'amount')(ArrayUtil.getLastElement<DailyAmount>(dailyAmountsFromService))),
            };
            saveDailyAmount(newDailyAmount);
            setDailyAmounts(append(newDailyAmount, drop(1, dailyAmountsFromService)));
          }
        }
      }
    };
    checkDailyAmounts();
  }, []);

  const saveDailyAmount = async (dailyAmount: DailyAmount) => {
    try {
      await faunaDbApiDailyAmount.saveDailyAmounts(dailyAmount);
    } catch (error: unknown) {
      console.error(error);
    }
  };

  const renderPnlDailyBarChart = (): JSX.Element => {
    const dailyAmountSum = parseFloat(dailyAmounts.reduce((acc, curr) => (acc = acc + (curr.pnl || 0)), 0).toFixed(3));
    return (
      <BarChart
        data={map(propOr(0, 'pnl'), dailyAmounts) as number[]}
        labels={map(propOr('', 'dateLabel'), dailyAmounts) as string[]}
        title={`Daily PNL (${dailyAmountSum > 0 ? '+' : ''} ${dailyAmountSum})`}
        titleColor={`${dailyAmountSum > 0 ? 'green' : 'red'}`}
      />
    );
  };

  return <>{dailyAmounts.length > 0 && renderPnlDailyBarChart()}</>;
};

export default DailyPnlChart;
