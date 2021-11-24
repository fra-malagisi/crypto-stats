import { ICrypto } from './crypto.models';

export type UpdateCryptoProps = {
  crypto: ICrypto;
  action?: () => void;
};
