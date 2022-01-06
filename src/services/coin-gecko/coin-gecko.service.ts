import axios, { AxiosResponse } from 'axios';
import { ICoin } from 'types';

type CryptoPrice = { current_price: number; price_change_percentage_24h: number };

type CryptoHistory = {
  market_data: {
    current_price: { eur: string };
  };
};

export type cryptoPrinceInfo = {
  price: number;
  price24hChange: number;
};

async function coins(): Promise<ICoin[]> {
  return await axios
    .get<ICoin[]>(`${process.env.REACT_APP_COIN_GECKO_API_URL}coins/list`)
    .then((response: AxiosResponse<ICoin[]>) => response.data);
}

async function getCryptoPrice(cryptoId: string): Promise<cryptoPrinceInfo> {
  return await axios
    .get<CryptoPrice[]>(
      `${process.env.REACT_APP_COIN_GECKO_API_URL}coins/markets?vs_currency=eur&ids=${cryptoId}&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h`
    )
    .then((response: AxiosResponse<CryptoPrice[]>) => ({
      price: response.data[0].current_price,
      price24hChange: response.data[0].price_change_percentage_24h,
    }));
}

async function getCryptoHistory(cryptoId: string, date: string): Promise<number> {
  return await axios
    .get<CryptoHistory>(`${process.env.REACT_APP_COIN_GECKO_API_URL}coins/${cryptoId}/history?date=${date}`)
    .then((response: AxiosResponse<CryptoHistory>) => parseFloat(response.data['market_data']['current_price'].eur));
}

const coinGeckoApi = {
  coins,
  getCryptoPrice,
  getCryptoHistory,
};

export default coinGeckoApi;
