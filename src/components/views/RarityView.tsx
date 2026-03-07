import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NFTData, TraitIndex } from '../../types/nft';
import { calculateRarityScore } from '../../utils/metaplex';

interface RarityViewProps {
  nfts: NFTData[];
  traitIndex: TraitIndex;
}

export function RarityView({ nfts, traitIndex }: RarityViewProps) {
  const [selectedNft, setSelectedNft] = useState<NFTData | null>(null);
  const [page, setPage] = useState(0);
  const pageSize = 25;

  const rankedNfts = useMemo(() => {
    return nfts
      .map((nft) => ({
        nft,
        score: calculateRarityScore(nft, traitIndex, nfts.length),
      }))
      .sort((a, b) => b.score - a.score)
      .map((item, index) => ({ ...item, rank: index + 1 }));
  }, [nfts, traitIndex]);

  const paginatedNfts = rankedNfts.slice(page * pageSize, (page + 1) * pageSize);
  const totalPages = Math.ceil(rankedNfts.length / pageSize);

  const getRarityLabel = (score: number) => {
    if (score >= 80) return { label: 'Legendary', color: 'text-yellow-400', bg: 'bg-yellow-400/10' };
    if (score >= 60) return { label: 'Epic', color: 'text-purple-400', bg: 'bg-purple-400/10' };
    if (score >= 40) return { label: 'Rare', color: 'text-blue-400', bg: 'bg-blue-400/10' };
    if (score >= 20) return { label: 'Uncommon', color: 'text-green-400', bg: 'bg-green-400/10' };
    return { label: 'Common', color: 'text-gray-400', bg: 'bg-gray-400/10' };
  };

  if (nfts.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center py-20"
      >
        <div className="w-20 h-20 rounded-2xl bg-dark-surface border border-dark-border flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-white mb-2">No Rarity Data</h3>
        <p className="text-gray-500 text-center max-w-md">
          Load a collection first to see the rarity rankings.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Rarity Rankings</h1>
        <p className="text-gray-500">NFTs ranked by rarity score</p>
      </div>

      {/* Rarity Distribution */}
      <div className="grid grid-cols-5 gap-3 mb-8">
        {['Legendary', 'Epic', 'Rare', 'Uncommon', 'Common'].map((tier) => {
          const count = rankedNfts.filter((item) => getRarityLabel(item.score).label === tier).length;
          const rarity = getRarityLabel(tier === 'Legendary' ? 80 : tier === 'Epic' ? 60 : tier === 'Rare' ? 40 : tier === 'Uncommon' ? 20 : 0);
          return (
            <div key={tier} className={`${rarity.bg} border border-dark-border rounded-xl p-4 text-center`}>
              <p className={`text-2xl font-bold ${rarity.color}`}>{count}</p>
              <p className="text-xs text-gray-500 mt-1">{tier}</p>
            </div>
          );
        })}
      </div>

      {/* Rankings Table */}
      <div className="bg-dark-surface border border-dark-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-dark-border">
                <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Rank</th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">NFT</th>
                <th className="px-5 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Rarity</th>
                <th className="px-5 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {paginatedNfts.map((item, index) => {
                const rarity = getRarityLabel(item.score);
                return (
                  <motion.tr
                    key={item.nft.mint}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: index * 0.02 }}
                    onClick={() => setSelectedNft(item.nft)}
                    className="hover:bg-dark-hover cursor-pointer transition-colors"
                  >
                    <td className="px-5 py-4">
                      <span className={`text-lg font-bold ${item.rank <= 3 ? 'text-yellow-400' : item.rank <= 10 ? 'text-gray-300' : 'text-gray-500'}`}>
                        #{item.rank}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.nft.image}
                          alt={item.nft.name}
                          className="w-10 h-10 rounded-lg object-cover bg-dark-card"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23374151"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>';
                          }}
                        />
                        <div>
                          <p className="font-medium text-gray-200">{item.nft.name}</p>
                          <p className="text-xs text-gray-600 font-mono">{item.nft.mint.slice(0, 8)}...</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${rarity.color} ${rarity.bg}`}>
                        {rarity.label}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <span className="text-lg font-semibold text-white">{item.score.toFixed(1)}</span>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-dark-border">
            <p className="text-sm text-gray-500">
              Showing {page * pageSize + 1}-{Math.min((page + 1) * pageSize, rankedNfts.length)} of {rankedNfts.length}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="px-3 py-1.5 bg-dark-card border border-dark-border rounded-lg text-sm text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <span className="text-sm text-gray-500">
                Page {page + 1} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={page >= totalPages - 1}
                className="px-3 py-1.5 bg-dark-card border border-dark-border rounded-lg text-sm text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* NFT Detail Modal */}
      <AnimatePresence>
        {selectedNft && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedNft(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-dark-surface border border-dark-border rounded-2xl max-w-lg w-full max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="aspect-square bg-dark-card relative">
                <img src={selectedNft.image} alt={selectedNft.name} className="w-full h-full object-cover" />
                <button
                  onClick={() => setSelectedNft(null)}
                  className="absolute top-3 right-3 w-8 h-8 bg-dark-bg/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-dark-bg transition-colors"
                >
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-5">
                <h2 className="text-xl font-bold text-white">{selectedNft.name}</h2>
                <div className="mt-4 grid grid-cols-2 gap-2">
                  {selectedNft.attributes.map((attr, idx) => (
                    <div key={idx} className="bg-dark-card border border-dark-border rounded-lg p-3">
                      <p className="text-xs text-gray-500 uppercase tracking-wide">{attr.trait_type}</p>
                      <p className="text-sm font-medium text-gray-200 mt-0.5">{attr.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
