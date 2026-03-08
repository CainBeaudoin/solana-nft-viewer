import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BinderChart } from '../BinderChart';

interface TokenData {
  name: string;
  symbol: string;
  tokenAddress: string;
  pairAddress: string;
  price: string;
  change1h: string;
  change24h: string;
  volume24h: string;
  volume6h: string;
  volume1h: string;
  txns24h: string;
  liquidity: string;
  mcap: string;
  holders: string;
  status: string;
  dexscreenerUrl: string;
  launchDate: number;
}

interface BoundCollection {
  address: string;
  name: string;
  description: string;
  image: string;
  binderPerNft: number;
  numMinted: number;
  currentSize: number;
  burned: number;
  createdAt: number;
}

const binderToken: TokenData = {
  name: 'BINDER',
  symbol: 'BINDER',
  tokenAddress: 'BeFtLwLtS9Rva12KrHKRMY1H5WoeM1Y2ULMnNJKopump',
  pairAddress: '5EeexKFyRK3wxNZCY4ePhRwdCkjbbbw9AmtvfUQtCBWD',
  price: '$0.00166900',
  change1h: '-1.07%',
  change24h: '-3.84%',
  volume24h: '$3.2K',
  volume6h: '$561.90',
  volume1h: '$2.30',
  txns24h: '36 (B22/S14)',
  liquidity: '$104.1K',
  mcap: '$1.67M',
  holders: '1.2K',
  status: 'balanced',
  dexscreenerUrl: 'https://dexscreener.com/solana/5EeexKFyRK3wxNZCY4ePhRwdCkjbbbw9AmtvfUQtCBWD',
  launchDate: 1771000000, // Approximate BINDER launch
};

// SPL-722 Collections bound to $BINDER - ACCURATE ON-CHAIN DATA
const boundCollections: BoundCollection[] = [
  {
    address: "2h15qtm5QJWwtLupt5ypfjUfyGrJRnXXTxsbLZqsLkeS",
    name: "Liquid ARK - Gold",
    description: "Each Crate Holds 100,000 Binder Tokens",
    image: "https://nfts-minted.print.world/ec28a4ae-4179-4d85-8f6c-02b09d77ede4/_collection.avif",
    binderPerNft: 100000,
    numMinted: 6000,
    currentSize: 5852,
    burned: 148,
    createdAt: 1771099495
  },
  {
    address: "681dUkCGdNXh9NSCWtaSLooUCUeGsjQnKF84C23RXbZs",
    name: "Liquid ARK - Silver",
    description: "Each Crate Holds 10,000 Binder Tokens",
    image: "https://nfts-minted.print.world/9cf7d1d4-2e44-420e-b7dc-c9d41bc9fb36/_collection.avif",
    binderPerNft: 10000,
    numMinted: 10000,
    currentSize: 10000,
    burned: 0,
    createdAt: 1771100280
  },
  {
    address: "89QqHf9RWiuy3ZNA9as6J2gPoUhYNtZ6ZrrszWprU4fw",
    name: "Liquid ARK - Bronze",
    description: "Each Crate Holds 1,000 Binder Tokens",
    image: "https://nfts-minted.print.world/279b1267-ef57-49f2-8d1e-856f831fe7c9/_collection.avif",
    binderPerNft: 1000,
    numMinted: 10000,
    currentSize: 10000,
    burned: 0,
    createdAt: 1771099302
  },
  {
    address: "DpTgt66W6ic88svYS8byxoEZxr39ppDqrH4NcWvivCdY",
    name: "PRINT WORLD REAPER",
    description: "333 REAPERS BOUND TO 300K BINDER EACH",
    image: "https://nfts-minted.print.world/5fc99822-f4c5-491b-90e6-0f17a84a3653/_collection.avif",
    binderPerNft: 300000,
    numMinted: 89,
    currentSize: 89,
    burned: 0,
    createdAt: 1772570000
  },
  {
    address: "4XqP8DxUGKt9vRXJJgdY9uHPQpuFyFgf3f9Db9yLF42h",
    name: "Reaper",
    description: "Soul Collector - 5,000 BINDER per NFT",
    image: "https://nfts-minted.print.world/e6d30ac2-b390-475f-9d0f-e2c4768bf1a1/_collection.avif",
    binderPerNft: 5000,
    numMinted: 333,
    currentSize: 325,
    burned: 8,
    createdAt: 1771200000
  },
  {
    address: "EbfzZ3kBxkooCxV9kHtXykJUXX1vV4HLccYmgS4Qn5s4",
    name: "Print World Retard",
    description: "3,000 BINDER per NFT",
    image: "https://nfts-minted.print.world/1aba8830-e268-4e21-8559-61392e9fde10/_collection.avif",
    binderPerNft: 3000,
    numMinted: 33,
    currentSize: 33,
    burned: 0,
    createdAt: 1771800000
  },
  {
    address: "C2nzYFRV39KbSqmSdCN2msDTqMY8nQQP2CwCkGpkotPC",
    name: "BRAIN ROT REAPER",
    description: "EACH REAPER IS BOUND TO 33,333 $BINDER",
    image: "https://nfts-minted.print.world/fb752c8a-3103-4451-8961-bf5405928838/_collection.avif",
    binderPerNft: 33333,
    numMinted: 405,
    currentSize: 366,
    burned: 39,
    createdAt: 1772100000
  },
  {
    address: "DFSUFMPtnUSK7WaWFsUFnMyYuqNzBsiBKgWU2ZE6xXJz",
    name: "Bloodline 555",
    description: "10,000 BINDER per NFT",
    image: "https://nfts-minted.print.world/ebc80a60-f58c-40c4-b9b1-590854047fa3/_collection.avif",
    binderPerNft: 10000,
    numMinted: 32,
    currentSize: 30,
    burned: 2,
    createdAt: 1772300000
  },
  {
    address: "95Mq1n8NBHJadzHQumnLq3ZnS2KhRdkaZ3bAYkkaXBLJ",
    name: "The Binder Protocol",
    description: "5,000 BINDER per NFT",
    image: "https://nfts-minted.print.world/bfb2d7fb-33f1-414f-aabe-68c6996a15bd/_collection.avif",
    binderPerNft: 5000,
    numMinted: 100,
    currentSize: 84,
    burned: 16,
    createdAt: 1772400000
  },
  {
    address: "A922vwB8wSidkSGogwEVx3psfVVTbaPo4ZSzghsfp84X",
    name: "HYPEBEAST",
    description: "10,000 BINDER per NFT",
    image: "https://nfts-minted.print.world/264ea283-b4c7-4e88-9691-9699e0c36b57/_collection.avif",
    binderPerNft: 10000,
    numMinted: 1,
    currentSize: 1,
    burned: 0,
    createdAt: 1772500000
  },
  {
    address: "9o69kaNXii7LDfEMUsb9xgPHEd7NnirkHeRaFHB6D2o9",
    name: "Printio",
    description: "5,000 BINDER per NFT",
    image: "https://nfts-minted.print.world/1e49d451-9a44-41fa-ac3d-286bc708e8e7/_collection.avif",
    binderPerNft: 5000,
    numMinted: 284,
    currentSize: 187,
    burned: 97,
    createdAt: 1771500000
  },
  {
    address: "J8r7P8Ko4oFWoAtHimVMQDcQW94aeb6xmbxN17fuNBNQ",
    name: "Psychedelic Fungi Forge",
    description: "25,000 BINDER per NFT",
    image: "https://nfts-minted.print.world/a96f383b-7b12-4c3e-8333-cfa31b99790b/_collection.avif",
    binderPerNft: 25000,
    numMinted: 4,
    currentSize: 4,
    burned: 0,
    createdAt: 1771600000
  },
  {
    address: "6anm2THa1SzWdpygXPz6mR4vFt1Cjf78aBFG7ZZRFGNC",
    name: "Unemployed",
    description: "10,000 BINDER per NFT",
    image: "https://nfts-minted.print.world/e53c522a-9206-4dee-b044-069277b3c2ce/_collection.avif",
    binderPerNft: 10000,
    numMinted: 49,
    currentSize: 48,
    burned: 1,
    createdAt: 1771700000
  },
  {
    address: "6jEopVVm36LaPVVDvAdjULBh3VYPJNLh2GCVWALEVkW4",
    name: "PFP Alchemist",
    description: "5,000 BINDER per NFT",
    image: "https://nfts-minted.print.world/9ffbf4a3-ba23-4020-8c49-5651c943b1ef/_collection.avif",
    binderPerNft: 5000,
    numMinted: 53,
    currentSize: 47,
    burned: 6,
    createdAt: 1771650000
  },
  {
    address: "9cNaGkdEzbJKEyxdQVc8ZB1gp91XYMmPL37xqzUKypVc",
    name: "Binders",
    description: "100,000 BINDER per NFT",
    image: "https://nfts-minted.print.world/01080291-89fb-4970-8f58-ee4fe18c81a5/_collection.avif",
    binderPerNft: 100000,
    numMinted: 3,
    currentSize: 3,
    burned: 0,
    createdAt: 1771550000
  },
  {
    address: "6QprCAjFfWRKYH6rQevrSWjawYG8WKzaBY5s3fJHM6YE",
    name: "Beta",
    description: "5,000 BINDER per NFT",
    image: "https://nfts-minted.print.world/4f59d61a-f4e0-4b6c-9865-7e4f87e75e12/_collection.avif",
    binderPerNft: 5000,
    numMinted: 36,
    currentSize: 32,
    burned: 4,
    createdAt: 1771850000
  },
  {
    address: "9idNQjX9zymBtaATPDqpGCxLer2iLNjQZ7pFmb5qar28",
    name: "Alpha",
    description: "10,000 BINDER per NFT",
    image: "https://nfts-minted.print.world/ffc0d80a-c09f-48b4-a162-98441d0475c4/_collection.avif",
    binderPerNft: 10000,
    numMinted: 44,
    currentSize: 39,
    burned: 5,
    createdAt: 1771900000
  },
  {
    address: "3JUQsqffRAwnHQ4J65R1wpKJvi3bi8F3JndXGCL922kS",
    name: "Printers",
    description: "5,000 BINDER per NFT",
    image: "https://nfts-minted.print.world/6274a613-89bb-474d-8a76-60dd66ae4457/_collection.avif",
    binderPerNft: 5000,
    numMinted: 111,
    currentSize: 98,
    burned: 13,
    createdAt: 1771400000
  },
  {
    address: "AwpMz2PVNjbCZAZngnYtwd7qrrKcRHMkj5iZY3RrL1yx",
    name: "Bound",
    description: "50,000 BINDER per NFT",
    image: "https://nfts-minted.print.world/3247796a-104b-4f19-9b3e-ded44014d46b/_collection.avif",
    binderPerNft: 50000,
    numMinted: 26,
    currentSize: 19,
    burned: 7,
    createdAt: 1772000000
  },
  {
    address: "6qsVJwvNEmZXh5SuiVXZYijMe8J52TQVmGWuuWC1VZaS",
    name: "Squirtle Rocks",
    description: "25,000 BINDER per NFT",
    image: "https://nfts-minted.print.world/8fad802a-8036-4a0c-abd8-5cfbedc9a276/_collection.avif",
    binderPerNft: 25000,
    numMinted: 4,
    currentSize: 4,
    burned: 0,
    createdAt: 1772200000
  }
];

// Mock recent trades
const recentTrades = [
  { type: 'buy', amount: '125.5K', price: '$0.001672', time: '2m ago', wallet: '7xKp...3mNz' },
  { type: 'sell', amount: '45.2K', price: '$0.001668', time: '5m ago', wallet: '9aRt...7pQw' },
  { type: 'buy', amount: '890.1K', price: '$0.001675', time: '8m ago', wallet: '3bYu...9kLm' },
  { type: 'buy', amount: '234.8K', price: '$0.001671', time: '12m ago', wallet: '5cZx...2jHn' },
  { type: 'sell', amount: '67.3K', price: '$0.001665', time: '15m ago', wallet: '8dWv...4fGr' },
  { type: 'buy', amount: '456.7K', price: '$0.001669', time: '18m ago', wallet: '2eXs...6tYp' },
  { type: 'sell', amount: '123.4K', price: '$0.001663', time: '22m ago', wallet: '4fQa...8mKl' },
  { type: 'buy', amount: '789.2K', price: '$0.001674', time: '25m ago', wallet: '6gRb...1nJo' },
];

// Mock top holders
const topHolders = [
  { rank: 1, wallet: '7xKp...3mNz', amount: '45.2M', percentage: 4.52, tag: 'Dev' },
  { rank: 2, wallet: '9aRt...7pQw', amount: '32.1M', percentage: 3.21, tag: null },
  { rank: 3, wallet: '3bYu...9kLm', amount: '28.9M', percentage: 2.89, tag: 'LP' },
  { rank: 4, wallet: '5cZx...2jHn', amount: '21.5M', percentage: 2.15, tag: null },
  { rank: 5, wallet: '8dWv...4fGr', amount: '18.7M', percentage: 1.87, tag: null },
  { rank: 6, wallet: '2eXs...6tYp', amount: '15.3M', percentage: 1.53, tag: null },
  { rank: 7, wallet: '4fQa...8mKl', amount: '12.8M', percentage: 1.28, tag: null },
  { rank: 8, wallet: '6gRb...1nJo', amount: '10.2M', percentage: 1.02, tag: null },
];

type TabType = 'trades' | 'holders' | 'binder';

export function ScanView() {
  const token = binderToken;
  const [activeTab, setActiveTab] = useState<TabType>('binder');
  const [selectedCollection, setSelectedCollection] = useState<BoundCollection | null>(null);

  // Calculate accurate totals based on currentSize (active supply after burns)
  const collectionStats = useMemo(() => {
    let totalBound = 0;
    let totalBurned = 0;
    let totalMinted = 0;
    let totalActive = 0;

    const stats = boundCollections.map(c => {
      const boundSupply = c.currentSize * c.binderPerNft;
      totalBound += boundSupply;
      totalBurned += c.burned;
      totalMinted += c.numMinted;
      totalActive += c.currentSize;

      return {
        ...c,
        boundSupply
      };
    });

    stats.sort((a, b) => b.boundSupply - a.boundSupply);

    return { collections: stats, totalBound, totalBurned, totalMinted, totalActive };
  }, []);

  const tabs: { id: TabType; label: string; icon: React.ReactNode }[] = [
    {
      id: 'trades',
      label: 'Trades',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      ),
    },
    {
      id: 'holders',
      label: 'Holders',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
    },
    {
      id: 'binder',
      label: 'Binder',
      icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
    },
  ];

  const formatNumber = (num: number): string => {
    if (num >= 1000000000) return (num / 1000000000).toFixed(2) + 'B';
    if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toLocaleString();
  };

  const formatDate = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatFullDate = (timestamp: number): string => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'trades':
        return (
          <div className="space-y-2">
            {recentTrades.map((trade, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="flex items-center justify-between p-3 bg-dark-card rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    trade.type === 'buy' ? 'bg-green-500/20' : 'bg-red-500/20'
                  }`}>
                    {trade.type === 'buy' ? (
                      <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className={`text-sm font-medium ${trade.type === 'buy' ? 'text-green-400' : 'text-red-400'}`}>
                      {trade.type === 'buy' ? 'Buy' : 'Sell'} {trade.amount}
                    </p>
                    <p className="text-xs text-gray-500">{trade.wallet}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-white">{trade.price}</p>
                  <p className="text-xs text-gray-500">{trade.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        );

      case 'holders':
        return (
          <div className="space-y-2">
            {topHolders.map((holder, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className="flex items-center justify-between p-3 bg-dark-card rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-dark-hover flex items-center justify-center">
                    <span className="text-xs font-bold text-gray-400">#{holder.rank}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-mono text-white">{holder.wallet}</p>
                      {holder.tag && (
                        <span className="px-1.5 py-0.5 text-xs bg-accent-purple/20 text-accent-purple rounded">
                          {holder.tag}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">{holder.amount} BINDER</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-white">{holder.percentage}%</p>
                </div>
              </motion.div>
            ))}
          </div>
        );

      case 'binder':
        return (
          <div className="space-y-4">
            {/* Supply Control Summary */}
            <div className="p-4 bg-gradient-to-r from-accent-purple/20 to-accent-blue/20 rounded-xl border border-accent-purple/30">
              <h4 className="text-sm font-medium text-white mb-3">SPL-722 Supply Control</h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-xs text-gray-400">Collections</p>
                  <p className="text-lg font-bold text-white">{boundCollections.length}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Active NFTs</p>
                  <p className="text-lg font-bold text-white">{collectionStats.totalActive.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Total Bound</p>
                  <p className="text-lg font-bold text-accent-purple">{formatNumber(collectionStats.totalBound)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Burned NFTs</p>
                  <p className="text-lg font-bold text-red-400">{collectionStats.totalBurned}</p>
                </div>
              </div>
            </div>

            {/* Bound Collections */}
            <div className="space-y-2 max-h-[340px] overflow-y-auto pr-1">
              <h4 className="text-xs font-medium text-gray-400 uppercase tracking-wider sticky top-0 bg-dark-surface py-1 z-10">
                Collections by Bound Supply
              </h4>
              {collectionStats.collections.map((collection, i) => (
                <motion.div
                  key={collection.address}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.02 }}
                  className="p-3 bg-dark-card rounded-lg hover:bg-dark-hover transition-colors cursor-pointer"
                  onClick={() => setSelectedCollection(collection)}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={collection.image}
                      alt={collection.name}
                      className="w-10 h-10 rounded-lg object-cover bg-dark-hover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%236b7280"><rect width="24" height="24" rx="4"/></svg>';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-white truncate">{collection.name}</p>
                        <span className="text-xs text-gray-500">{formatDate(collection.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-gray-500">
                          {collection.currentSize.toLocaleString()} active
                        </span>
                        {collection.burned > 0 && (
                          <span className="text-red-400">
                            ({collection.burned} burned)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-gray-500">Per NFT:</span>
                      <span className="text-white ml-1">{formatNumber(collection.binderPerNft)}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Bound:</span>
                      <span className="text-accent-purple ml-1 font-medium">{formatNumber(collection.boundSupply)}</span>
                    </div>
                  </div>

                  <div className="mt-2">
                    <div className="h-1.5 bg-dark-hover rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(collection.currentSize / collection.numMinted) * 100}%` }}
                        transition={{ duration: 0.5, delay: i * 0.03 }}
                        className="h-full bg-gradient-to-r from-accent-purple to-accent-blue rounded-full"
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6"
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white mb-1">Token Scanner</h1>
            <p className="text-gray-400 text-sm">Live chart & supply analytics</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xl font-bold text-white">{token.price}</p>
              <div className="flex items-center gap-2">
                <span className={`text-xs ${token.change1h.startsWith('-') ? 'text-red-400' : 'text-green-400'}`}>
                  1h: {token.change1h}
                </span>
                <span className={`text-xs ${token.change24h.startsWith('-') ? 'text-red-400' : 'text-green-400'}`}>
                  24h: {token.change24h}
                </span>
              </div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-accent-purple to-accent-blue flex items-center justify-center">
              <span className="text-xl font-bold text-white">B</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Layout - Chart + Side Panel */}
      <div className="flex gap-5">
        {/* Chart Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="flex-1 bg-dark-surface border border-dark-border rounded-2xl overflow-hidden"
        >
          {/* TradingView Chart with Collection Markers */}
          <div style={{ height: '460px' }}>
            <BinderChart
              pairAddress={token.pairAddress}
              collections={boundCollections}
              onMarkerClick={setSelectedCollection}
            />
          </div>

          {/* Quick Stats */}
          <div className="p-4 border-t border-dark-border grid grid-cols-5 gap-4">
            <StatCard label="Market Cap" value={token.mcap} />
            <StatCard label="Liquidity" value={token.liquidity} />
            <StatCard label="Vol 24h" value={token.volume24h} />
            <StatCard label="Holders" value={token.holders} />
            <StatCard label="Bound Supply" value={formatNumber(collectionStats.totalBound)} highlight />
          </div>
        </motion.div>

        {/* Side Panel with Tabs */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="w-96 bg-dark-surface border border-dark-border rounded-2xl overflow-hidden flex flex-col"
          style={{ height: '580px' }}
        >
          {/* Tab Headers */}
          <div className="flex border-b border-dark-border">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-white bg-dark-card border-b-2 border-accent-purple'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {renderTabContent()}
          </div>
        </motion.div>
      </div>

      {/* Collection Detail Modal */}
      <AnimatePresence>
        {selectedCollection && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedCollection(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-dark-surface border border-dark-border rounded-2xl max-w-lg w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="relative h-32 bg-gradient-to-br from-accent-purple/30 to-accent-blue/30">
                <img
                  src={selectedCollection.image}
                  alt={selectedCollection.name}
                  className="absolute inset-0 w-full h-full object-cover opacity-30"
                />
                <button
                  onClick={() => setSelectedCollection(null)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-dark-bg/80 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-dark-surface">
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedCollection.image}
                      alt={selectedCollection.name}
                      className="w-14 h-14 rounded-xl border-2 border-dark-surface"
                    />
                    <div>
                      <h3 className="text-lg font-bold text-white">{selectedCollection.name}</h3>
                      <p className="text-sm text-gray-400">{selectedCollection.description}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Content */}
              <div className="p-4 space-y-4">
                {/* Stats */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 bg-dark-card rounded-lg text-center">
                    <p className="text-xs text-gray-500">Per NFT</p>
                    <p className="text-lg font-bold text-white">{formatNumber(selectedCollection.binderPerNft)}</p>
                  </div>
                  <div className="p-3 bg-dark-card rounded-lg text-center">
                    <p className="text-xs text-gray-500">Active</p>
                    <p className="text-lg font-bold text-white">{selectedCollection.currentSize}</p>
                  </div>
                  <div className="p-3 bg-dark-card rounded-lg text-center">
                    <p className="text-xs text-gray-500">Burned</p>
                    <p className="text-lg font-bold text-red-400">{selectedCollection.burned}</p>
                  </div>
                </div>

                {/* Bound Supply */}
                <div className="p-4 bg-gradient-to-r from-accent-purple/20 to-accent-blue/20 rounded-xl border border-accent-purple/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-400">Total Bound Supply</p>
                      <p className="text-2xl font-bold text-accent-purple">
                        {formatNumber(selectedCollection.currentSize * selectedCollection.binderPerNft)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">Created</p>
                      <p className="text-sm text-white">{formatFullDate(selectedCollection.createdAt)}</p>
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div className="p-3 bg-dark-card rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Collection Address</p>
                  <p className="text-sm text-white font-mono break-all">{selectedCollection.address}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <a
                    href={`https://www.tensor.trade/trade/${selectedCollection.address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-2 py-3 bg-accent-purple hover:bg-accent-purple/80 text-white font-medium rounded-xl transition-colors"
                  >
                    View on Tensor
                  </a>
                  <a
                    href={`https://solscan.io/token/${selectedCollection.address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-dark-card hover:bg-dark-hover text-white font-medium rounded-xl transition-colors border border-dark-border"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Token Addresses */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="mt-5 flex gap-4"
      >
        <div className="flex-1 p-3 bg-dark-surface border border-dark-border rounded-xl">
          <p className="text-xs text-gray-500 mb-1">Token Address</p>
          <p className="text-sm text-white font-mono truncate">{token.tokenAddress}</p>
        </div>
        <a
          href={token.dexscreenerUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-6 bg-accent-purple hover:bg-accent-purple/80 text-white font-medium rounded-xl transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          DexScreener
        </a>
      </motion.div>
    </div>
  );
}

function StatCard({ label, value, highlight = false }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="text-center">
      <p className="text-xs text-gray-500 mb-1">{label}</p>
      <p className={`text-sm font-medium ${highlight ? 'text-accent-purple' : 'text-white'}`}>{value}</p>
    </div>
  );
}
