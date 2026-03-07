import { motion } from 'framer-motion';
import { NFTData } from '../../types/nft';

interface MarketViewProps {
  nfts: NFTData[];
  collectionName?: string;
}

export function MarketView({ nfts, collectionName }: MarketViewProps) {
  if (nfts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-20"
      >
        <div className="w-20 h-20 rounded-2xl bg-dark-surface border border-dark-border flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">No Market Data</h3>
        <p className="text-gray-500 text-center max-w-md">
          Load a collection first to see market information.
        </p>
      </motion.div>
    );
  }

  // Placeholder market data (would need API integration for real data)
  const marketData = {
    floorPrice: '---',
    totalVolume: '---',
    listed: '---',
    owners: '---',
  };

  const marketplaces = [
    { name: 'Magic Eden', url: 'https://magiceden.io', icon: 'ME' },
    { name: 'Tensor', url: 'https://tensor.trade', icon: 'T' },
    { name: 'OpenSea', url: 'https://opensea.io', icon: 'OS' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Market</h1>
        <p className="text-gray-500">
          {collectionName ? `Market data for ${collectionName}` : 'Collection market overview'}
        </p>
      </div>

      {/* Market Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-dark-surface border border-dark-border rounded-xl p-5">
          <p className="text-sm text-gray-500 mb-1">Floor Price</p>
          <p className="text-2xl font-bold text-white">{marketData.floorPrice}</p>
          <p className="text-xs text-gray-600 mt-1">SOL</p>
        </div>
        <div className="bg-dark-surface border border-dark-border rounded-xl p-5">
          <p className="text-sm text-gray-500 mb-1">Total Volume</p>
          <p className="text-2xl font-bold text-white">{marketData.totalVolume}</p>
          <p className="text-xs text-gray-600 mt-1">SOL</p>
        </div>
        <div className="bg-dark-surface border border-dark-border rounded-xl p-5">
          <p className="text-sm text-gray-500 mb-1">Listed</p>
          <p className="text-2xl font-bold text-white">{marketData.listed}</p>
          <p className="text-xs text-gray-600 mt-1">of {nfts.length}</p>
        </div>
        <div className="bg-dark-surface border border-dark-border rounded-xl p-5">
          <p className="text-sm text-gray-500 mb-1">Supply</p>
          <p className="text-2xl font-bold text-white">{nfts.length.toLocaleString()}</p>
          <p className="text-xs text-gray-600 mt-1">NFTs</p>
        </div>
      </div>

      {/* Trade on Marketplaces */}
      <div className="bg-dark-surface border border-dark-border rounded-2xl overflow-hidden mb-8">
        <div className="p-5 border-b border-dark-border">
          <h2 className="text-lg font-semibold text-white">Trade on Marketplaces</h2>
          <p className="text-sm text-gray-500 mt-1">View and trade this collection on popular marketplaces</p>
        </div>
        <div className="p-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {marketplaces.map((mp) => (
              <a
                key={mp.name}
                href={mp.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-dark-card border border-dark-border rounded-xl hover:border-gray-600 transition-colors group"
              >
                <div className="w-12 h-12 rounded-xl bg-dark-hover flex items-center justify-center text-lg font-bold text-gray-400 group-hover:text-white transition-colors">
                  {mp.icon}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-200 group-hover:text-white transition-colors">{mp.name}</p>
                  <p className="text-xs text-gray-600">View collection</p>
                </div>
                <svg className="w-5 h-5 text-gray-600 group-hover:text-gray-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Info Notice */}
      <div className="p-5 bg-blue-500/10 border border-blue-500/20 rounded-xl">
        <div className="flex items-start gap-3">
          <svg className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="text-sm text-blue-400 font-medium">Market Data Coming Soon</p>
            <p className="text-sm text-blue-400/70 mt-1">
              Real-time floor prices, volume, and listing data will be available in a future update.
              For now, visit the marketplaces directly to see current prices.
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
