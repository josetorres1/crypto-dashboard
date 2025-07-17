import { json, type LoaderFunction, type MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { CryptoCard } from "~/components/cryto-card";
import { cryptoDetails } from "~/data/currencies";
import { CryptoCurrency } from "~/entities/currency";

export const meta: MetaFunction = () => {
  return [
    { title: "Crypto Dashboard" },
    { name: "description", content: "the best crypto dashboard" },
  ];
};

const CRYPTO_CURRENCIES = [
  "BTC",
  "ETH",
  "SOL",
  "DOGE",
  "ADA",
  "XRP",
  "DOT",
  "LTC",
  "BCH",
  "LINK",
];

export const loader: LoaderFunction = async () => {
  const API_URL = "https://api.coinbase.com/v2/exchange-rates?currency=";
  try {
    const usdResponse = await fetch(`${API_URL}USD`);
    if (!usdResponse.ok) {
      throw new Error(`Failed to fetch USD rates: ${usdResponse.statusText}`);
    }
    const usdData = await usdResponse.json();
    const usdRates = usdData.data.rates;

    const btcResponse = await fetch(`${API_URL}BTC`);
    if (!btcResponse.ok) {
      throw new Error(`Failed to fetch USD rates: ${btcResponse.statusText}`);
    }
    const btcData = await btcResponse.json();
    const btcRates = btcData.data.rates;

    const combinedData: CryptoCurrency[] = CRYPTO_CURRENCIES.map((currency) => {
      const rateInUSD = 1 / parseFloat(usdRates[currency]);
      const rateInBTC = 1 / parseFloat(btcRates[currency]);
      return {
        name: cryptoDetails[currency].name || currency,
        symbol: currency,
        rateBTC: isNaN(rateInBTC) ? 0 : rateInBTC,
        rateUSD: isNaN(rateInUSD) ? 0 : rateInUSD,
        logoUrl: `https://placehold.co/40x40/${
          cryptoDetails[currency]?.logoColor || "CCCCCC"
        }/FFFFFF?text=${currency.charAt(0)}`,
      };
    });

    return json({ cryptoCurrencies: combinedData, error: null });
  } catch (error) {
    console.error("Error fetching from Coinbase API:", error);
    return json(
      {
        cryptoCurrencies: [],
        error: "Failed to load data from Coinbase API.",
      },
      { status: 500 }
    );
  }
};

export default function Index() {
  const { cryptoCurrencies, error } = useLoaderData<typeof loader>();
  return (
    <div className="flex h-screen p-4 sm:p-8 ">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">
          Crypto Dashboard
        </h1>
        {error && (
          <div
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md"
            role="alert"
          >
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}

        {!error && cryptoCurrencies.length > 0 && (
          <div className="flex flex-wrap items-center gap-4 justify-center">
            {(cryptoCurrencies as CryptoCurrency[]).map((currency) => (
              <CryptoCard key={currency.name} crypto={currency} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
