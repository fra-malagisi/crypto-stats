import React, { useEffect, useState } from 'react';
import { PieChart } from '../../../charts';
import { ChartProps, ICrypto } from '../../../types';
import { reduce, append, propOr } from 'ramda';

export type CryptoPieChartProps = {
  allCrypto: ICrypto[];
};

const CryptoPieChart = ({ allCrypto }: CryptoPieChartProps): JSX.Element => {
  console.log('pie');
  const [pieChartProps, setPieChartProps] = useState<ChartProps>({ labels: [], colors: [], data: [] });

  useEffect(() => {
    setPieChartProps(getPieChartProps(allCrypto));
  }, [allCrypto]);

  const getPieChartProps = (cryptosData: ICrypto[]) =>
    reduce(
      (acc, curr) => ({
        labels: append(curr.name, acc.labels),
        colors: append(curr.color || '', acc.colors),
        data: append(propOr(0, 'myValue', curr), acc.data),
      }),
      { labels: [] as string[], colors: [] as string[], data: [] as number[] },
      cryptosData
    );

  return (
    <>
      {pieChartProps.labels.length > 0 && (
        <PieChart labels={pieChartProps.labels} colors={pieChartProps.colors} data={pieChartProps.data} />
      )}
    </>
  );
};

export default React.memo(CryptoPieChart);
