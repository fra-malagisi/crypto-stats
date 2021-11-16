import axios, { AxiosResponse } from 'axios';

const getCurrencyExchangeRatios = async (currency: string): Promise<Record<string, Record<string, number>>> => {
  return await axios
    .get<Record<string, Record<string, number>>>(`${process.env.REACT_APP_CURRENCIES_API_URL}${currency}.json`)
    .then((response: AxiosResponse<Record<string, Record<string, number>>>) => response.data);
};

const exchangeRatioApi = {
  getCurrencyExchangeRatios,
};

export default exchangeRatioApi;
