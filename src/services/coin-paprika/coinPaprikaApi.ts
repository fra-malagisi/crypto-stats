import axios, { AxiosResponse } from 'axios';
import { ICoin, ICryptoDetails, IMarketGlobalResponse } from 'types';

async function coins(): Promise<ICoin[]> {
  return await axios
    .get<ICoin[]>(`${process.env.REACT_APP_COIN_PAPRIKA_API_URL}coins`)
    .then((response: AxiosResponse<ICoin[]>) => response.data);
}

async function global(): Promise<IMarketGlobalResponse> {
  return await axios
    .get<IMarketGlobalResponse>(`${process.env.REACT_APP_COIN_PAPRIKA_API_URL}global`)
    .then((response: AxiosResponse<IMarketGlobalResponse>) => response.data);
}

async function getCryptoDetails(cryptoId: string): Promise<ICryptoDetails> {
  return await axios
    .get<ICryptoDetails[]>(`${process.env.REACT_APP_COIN_PAPRIKA_API_URL}coins/${cryptoId}/ohlcv/today`)
    .then((response: AxiosResponse<ICryptoDetails[]>) => response.data[0]);
}

const coinPaprikaApi = {
  global,
  coins,
  getCryptoDetails,
};

export default coinPaprikaApi;
