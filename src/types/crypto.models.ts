export interface ICrypto {
  ref?: string;
  id: string;
  qty: number;
  name: string;
  value?: number;
  myValue?: number;
  myValueFormatted?: string;
  valueFormatted?: string;
  color?: string;
  percentage?: string;
  price24Change?: number;
}
