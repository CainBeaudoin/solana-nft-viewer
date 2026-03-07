import { motion } from 'framer-motion';
import { NFTData, TraitIndex } from '../../types/nft';

interface AnalyticsViewProps {
  nfts: NFTData[];
  traitIndex: TraitIndex;
}

export function AnalyticsView({ nfts, traitIndex }: AnalyticsViewProps) {
  if (nfts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-20"
      >
        <div className="w-20 h-20 rounded-2xl bg-dark-surface border border-dark-border flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">No Data to Analyze</h3>
        <p className="text-gray-500 text-center max-w-md">
          Load a collection first to see analytics and insights.
        </p>
      </motion.div>
    );
  }

  const traitTypes = Object.keys(traitIndex);
  const totalTraits = traitTypes.reduce(
    (sum, type) => sum + Object.keys(traitIndex[type]).length,
    0
  );

  // Calculate trait distribution stats
  const traitStats = traitTypes.map((type) => {
    const values = Object.entries(traitIndex[type]);
    const uniqueValues = values.length;
    const mostCommon = values.sort(([, a], [, b]) => b - a)[0];
    const leastCommon = values.sort(([, a], [, b]) => a - b)[0];

    return {
      type,
      uniqueValues,
      mostCommon: mostCommon ? { value: mostCommon[0], count: mostCommon[1], percent: ((mostCommon[1] / nfts.length) * 100).toFixed(1) } : null,
      leastCommon: leastCommon ? { value: leastCommon[0], count: leastCommon[1], percent: ((leastCommon[1] / nfts.length) * 100).toFixed(1) } : null,
    };
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
        <p className="text-gray-500">Collection statistics and trait distribution</p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-dark-surface border border-dark-border rounded-xl p-5">
          <p className="text-sm text-gray-500 mb-1">Total NFTs</p>
          <p className="text-3xl font-bold text-white">{nfts.length.toLocaleString()}</p>
        </div>
        <div className="bg-dark-surface border border-dark-border rounded-xl p-5">
          <p className="text-sm text-gray-500 mb-1">Trait Types</p>
          <p className="text-3xl font-bold text-white">{traitTypes.length}</p>
        </div>
        <div className="bg-dark-surface border border-dark-border rounded-xl p-5">
          <p className="text-sm text-gray-500 mb-1">Unique Traits</p>
          <p className="text-3xl font-bold text-white">{totalTraits.toLocaleString()}</p>
        </div>
        <div className="bg-dark-surface border border-dark-border rounded-xl p-5">
          <p className="text-sm text-gray-500 mb-1">Avg Traits/NFT</p>
          <p className="text-3xl font-bold text-white">
            {nfts.length > 0 ? (nfts.reduce((sum, nft) => sum + nft.attributes.length, 0) / nfts.length).toFixed(1) : 0}
          </p>
        </div>
      </div>

      {/* Trait Distribution */}
      <div className="bg-dark-surface border border-dark-border rounded-xl overflow-hidden">
        <div className="p-5 border-b border-dark-border">
          <h2 className="text-lg font-semibold text-white">Trait Distribution</h2>
        </div>
        <div className="divide-y divide-dark-border">
          {traitStats.map((stat, index) => (
            <motion.div
              key={stat.type}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="p-5 hover:bg-dark-hover transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-white">{stat.type}</h3>
                <span className="text-sm text-gray-500">{stat.uniqueValues} variations</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {stat.mostCommon && (
                  <div className="bg-dark-card rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Most Common</p>
                    <p className="text-sm font-medium text-gray-200 truncate">{stat.mostCommon.value}</p>
                    <p className="text-xs text-accent-green mt-1">{stat.mostCommon.percent}% ({stat.mostCommon.count})</p>
                  </div>
                )}
                {stat.leastCommon && (
                  <div className="bg-dark-card rounded-lg p-3">
                    <p className="text-xs text-gray-500 mb-1">Rarest</p>
                    <p className="text-sm font-medium text-gray-200 truncate">{stat.leastCommon.value}</p>
                    <p className="text-xs text-yellow-400 mt-1">{stat.leastCommon.percent}% ({stat.leastCommon.count})</p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
