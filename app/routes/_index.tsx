import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  rectSortingStrategy,
  rectSwappingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import { json, type LoaderFunction, type MetaFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { useEffect, useMemo, useState } from "react";
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
  const [orderedCurrencies, setOrderedCurrencies] = useState<CryptoCurrency[]>(
    []
  );
  const [filter, setFilter] = useState("");

  useEffect(() => {
    if (cryptoCurrencies) {
      setOrderedCurrencies(cryptoCurrencies);
    }
  }, [cryptoCurrencies]);

  const currencyIds = useMemo(
    () => orderedCurrencies.map((c) => c.symbol),
    [orderedCurrencies]
  );

  const filteredCryptoCurrencies = useMemo(() => {
    if (!filter) return orderedCurrencies;
    const lowerFilter = filter.toLowerCase();

    return orderedCurrencies.filter((currency: CryptoCurrency) => {
      return (
        currency.name.toLowerCase().includes(lowerFilter) ||
        currency.symbol.toLowerCase().includes(lowerFilter)
      );
    });
  }, [filter, orderedCurrencies]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setOrderedCurrencies((prev) => {
        const oldIndex = prev.findIndex((item) => item.symbol === active.id);
        const newIndex = prev.findIndex((item) => item.symbol === over.id);
        return arrayMove(prev, oldIndex, newIndex);
      });
    }
  };

  return (
    <div className="flex h-screen p-4 sm:p-8 ">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-8 text-center">
            Crypto Dashboard
          </h1>
          <div className="relative max-w-md mx-auto">
            <input
              type="text"
              placeholder="Filter by name or Symbol"
              className="w-full px-4 py-2 text-gray-900 bg-white dark:bg-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
        </div>
        {/* if errors  */}
        {error && (
          <div
            className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md"
            role="alert"
          >
            <p className="font-bold">Error</p>
            <p>{error}</p>
          </div>
        )}

        {/* No error and results */}
        {!error && filteredCryptoCurrencies.length > 0 && (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={currencyIds} strategy={rectSortingStrategy}>
              <div className="flex flex-wrap items-center gap-4 justify-center">
                {(filteredCryptoCurrencies as CryptoCurrency[]).map(
                  (currency) => (
                    <CryptoCard key={currency.name} crypto={currency} />
                  )
                )}
              </div>
            </SortableContext>
          </DndContext>
        )}

        {/* No erorors and not results */}
        {!error && filteredCryptoCurrencies.length === 0 && (
          <p className="text-center text-white ">No currency found</p>
        )}
      </div>
    </div>
  );
}
