import { motion } from 'framer-motion';
import { NFTData, TraitIndex } from '../types/nft';
import { NFTCard } from './NFTCard';
import { calculateRarityScore } from '../utils/metaplex';

interface NFTGridProps {
  nfts: NFTData[];
  traitIndex: TraitIndex;
}

export function NFTGrid({ nfts, traitIndex }: NFTGridProps) {
  if (nfts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <svg className="w-16 h-16 text-gray-700 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <p className="text-gray-500 font-medium">No NFTs match your filters</p>
        <p className="text-gray-600 text-sm mt-1">Try adjusting your filter criteria</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4"
    >
      {nfts.map((nft, index) => (
        <motion.div
          key={nft.mint}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: Math.min(index * 0.02, 0.5) }}
        >
          <NFTCard
            nft={nft}
            rarityScore={calculateRarityScore(nft, traitIndex, nfts.length)}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
