export interface IMarketGlobalResponse {
  market_cap_usd: number;
  volume_24h_usd: number;
  bitcoin_dominance_percentage: number;
  cryptocurrencies_number: number;
  market_cap_ath_value: number;
  market_cap_ath_date: Date;
  volume_24h_ath_value: number;
  volume_24h_ath_date: Date;
  volume_24h_percent_from_ath: number;
  volume_24h_percent_to_ath: number;
  market_cap_change_24h: number;
  volume_24h_change_24h: number;
  last_updated: Date;
}

export interface ICoin {
  id: string;
  name: string;
  symbol: string;
  rank?: number;
  is_new?: boolean;
  is_active?: boolean;
  type?: string;
}

export interface ICryptoDetails {
  time_open: Date;
  time_close: Date;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  market_cap: number;
}
