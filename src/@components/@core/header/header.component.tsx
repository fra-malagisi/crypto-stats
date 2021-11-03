import { ReactComponent as Logo } from '@/assets/images/bitcoin-btc-logo.svg';

const Header = (): JSX.Element => (
  <header className="h-24 bg-blue-700 sticky top-0 flex justify-center items-center mb-4 z-10">
    <h1 className="font-sans text-white text-3xl mr-2">Crypto-stats</h1>
    <figure className="h-12">
      <Logo />
    </figure>
  </header>
);

export default Header;
