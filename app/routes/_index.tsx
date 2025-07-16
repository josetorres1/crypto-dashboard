import type { MetaFunction } from "@remix-run/node";
import { CryptoCard, mockCrypto } from "~/components/cryto-card";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-16">
        {new Array(10).map((_, index) => (
          <CryptoCard key={index.toString()} crypto={mockCrypto} />
        ))}
      </div>
    </div>
  );
}
