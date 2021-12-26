import axios, { AxiosResponse } from 'axios';
import { ICoin } from 'types';

type CryptoPrice = Record<string, { eur: number }>;

type CryptoHistory = {
  market_data: {
    current_price: { eur: string };
  };
};

async function coins(): Promise<ICoin[]> {
  return await axios
    .get<ICoin[]>(`${process.env.REACT_APP_COIN_GECKO_API_URL}coins/list`)
    .then((response: AxiosResponse<ICoin[]>) => response.data);
}

async function getCryptoPrice(cryptoId: string): Promise<number> {
  return await axios
    .get<CryptoPrice>(`${process.env.REACT_APP_COIN_GECKO_API_URL}simple/price?ids=${cryptoId}&vs_currencies=eur`)
    .then((response: AxiosResponse<CryptoPrice>) => response.data[cryptoId].eur);
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
