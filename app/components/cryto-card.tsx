import { PropsWithChildren } from "react";

interface CryptoCurrency {
  name: string;
  symbol: string;
  rateUSD: number;
  rateBTC: number;
  logoUrl: string;
}

export const mockCrypto: CryptoCurrency = {
  name: "Bitcoin",
  symbol: "BTC",
  rateUSD: 65000.0,
  rateBTC: 1.0,
  logoUrl: "https://placehold.co/40x40/F7931A/FFFFFF?text=B",
};

interface BaseProps
  extends PropsWithChildren<{
    className?: string;
  }> {}

const Card = ({ children, className = "" }: BaseProps) => (
  <div
    className={`bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm ${className}`}
  >
    {children}
  </div>
);

const CardHeader = ({ children, className = "" }: BaseProps) => (
  <div
    className={`p-6 flex flex-row items-center justify-between space-y-0 pb-2 ${className}`}
  >
    {children}
  </div>
);

const CardTitle = ({ children, className = "" }: BaseProps) => (
  <h3 className={`text-lg font-semibold tracking-tight ${className}`}>
    {children}
  </h3>
);

const CardDescription = ({ children, className = "" }: BaseProps) => (
  <p className={`text-sm text-gray-500 dark:text-gray-400 ${className}`}>
    {children}
  </p>
);

const CardContent = ({ children, className = "" }: BaseProps) => (
  <div className={`p-6 pt-0 ${className}`}>{children}</div>
);

export function CryptoCard({ crypto }: { crypto: CryptoCurrency }) {
  return (
    <Card className="w-full max-w-sm transform hover:scale-105 transition-transform duration-300 ease-in-out cursor-pointer">
      <CardHeader>
        <div className="flex flex-col">
          <CardTitle>{crypto.name}</CardTitle>
          <CardDescription>{crypto.symbol}</CardDescription>
        </div>
        <img
          src={crypto.logoUrl}
          alt={`${crypto.name} logo`}
          className="w-10 h-10 rounded-full"
        />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between items-baseline">
            <span className="text-gray-500 dark:text-gray-400 text-sm">
              USD Rate
            </span>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              $
              {new Intl.NumberFormat("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(crypto.rateUSD)}
            </span>
          </div>
          <div className="flex justify-between items-baseline">
            <span className="text-gray-500 dark:text-gray-400 text-sm">
              BTC Rate
            </span>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              ₿
              {new Intl.NumberFormat("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 6,
              }).format(crypto.rateBTC)}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
