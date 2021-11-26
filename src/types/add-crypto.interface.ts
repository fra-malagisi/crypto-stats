export interface AddCryptoProps {
  onCryptoAdded?: () => void;
}

export interface IAddCryptoForm {
  crypto: string;
  qty: string;
  color: string;
}
