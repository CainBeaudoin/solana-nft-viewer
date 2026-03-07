import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NFTData } from '../types/nft';

interface NFTCardProps {
  nft: NFTData;
  rarityScore?: number;
  onAttributeClick?: (traitType: string, value: string) => void;
}

export function NFTCard({ nft, rarityScore, onAttributeClick }: NFTCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const getRarityLabel = (score: number) => {
    if (score >= 80) return { label: 'Legendary', color: 'text-yellow-400' };
    if (score >= 60) return { label: 'Epic', color: 'text-purple-400' };
    if (score >= 40) return { label: 'Rare', color: 'text-blue-400' };
    if (score >= 20) return { label: 'Uncommon', color: 'text-green-400' };
    return { label: 'Common', color: 'text-gray-400' };
  };

  const rarity = rarityScore !== undefined ? getRarityLabel(rarityScore) : null;

  const truncateAddress = (address: string) => {
    if (!address) return 'Unknown';
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const handleAttributeClick = (traitType: string, value: string) => {
    if (onAttributeClick) {
      onAttributeClick(traitType, value);
      setShowDetails(false); // Close modal to show filtered results
    }
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.2 }}
        className="group bg-dark-surface border border-dark-border rounded-xl overflow-hidden cursor-pointer hover:border-gray-700 transition-colors"
        onClick={() => setShowDetails(true)}
      >
        <div className="aspect-square bg-dark-card relative overflow-hidden">
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-dark-border border-t-white rounded-full animate-spin"></div>
            </div>
          )}
          {imageError ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="w-10 h-10 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          ) : (
            <img
              src={nft.image}
              alt={nft.name}
              className={`w-full h-full object-cover transition-all duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              } group-hover:scale-105`}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          )}

          {/* Rarity badge */}
          {rarity && (
            <div className="absolute top-2 right-2 px-2 py-0.5 bg-dark-bg/80 backdrop-blur-sm rounded text-xs font-medium">
              <span className={rarity.color}>{rarity.label}</span>
            </div>
          )}
        </div>
        <div className="p-3">
          <h3 className="font-medium text-gray-200 truncate text-sm">{nft.name}</h3>
          {nft.owner && (
            <p className="text-xs text-gray-500 mt-1 font-mono">
              Owner: {truncateAddress(nft.owner)}
            </p>
          )}
          {rarityScore !== undefined && (
            <p className="text-xs text-gray-500 mt-1">
              Score: {rarityScore.toFixed(1)}
            </p>
          )}
        </div>
      </motion.div>

      {/* Details Modal */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowDetails(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2 }}
              className="bg-dark-surface border border-dark-border rounded-2xl max-w-lg w-full max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="aspect-square bg-dark-card relative">
                <img
                  src={nft.image}
                  alt={nft.name}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => setShowDetails(false)}
                  className="absolute top-3 right-3 w-8 h-8 bg-dark-bg/80 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-dark-bg transition-colors"
                >
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-white">{nft.name}</h2>
                    {rarity && (
                      <span className={`text-sm ${rarity.color}`}>{rarity.label}</span>
                    )}
                  </div>
                  {rarityScore !== undefined && (
                    <div className="text-right">
                      <p className="text-2xl font-bold text-white">{rarityScore.toFixed(1)}</p>
                      <p className="text-xs text-gray-500">Rarity Score</p>
                    </div>
                  )}
                </div>

                {/* Mint Address */}
                <div className="mt-4 p-3 bg-dark-card rounded-lg">
                  <p className="text-xs text-gray-500 mb-1">Mint Address</p>
                  <p className="text-xs text-gray-400 font-mono break-all">{nft.mint}</p>
                </div>

                {/* Owner */}
                {nft.owner && (
                  <div className="mt-3 p-3 bg-dark-card rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Owner</p>
                    <p className="text-xs text-gray-400 font-mono break-all">{nft.owner}</p>
                  </div>
                )}

                {/* Metadata URI */}
                {nft.uri && (
                  <div className="mt-3 p-3 bg-dark-card rounded-lg">
                    <p className="text-xs text-gray-500 mb-1">Metadata URI</p>
                    <a
                      href={nft.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-accent-purple hover:underline break-all"
                    >
                      {nft.uri}
                    </a>
                  </div>
                )}

                {nft.attributes.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-semibold text-gray-300 mb-3">
                      Attributes
                      {onAttributeClick && (
                        <span className="text-xs font-normal text-gray-500 ml-2">
                          (click to filter)
                        </span>
                      )}
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {nft.attributes.map((attr, index) => (
                        <button
                          key={index}
                          onClick={() => handleAttributeClick(attr.trait_type, attr.value)}
                          disabled={!onAttributeClick}
                          className={`bg-dark-card border border-dark-border rounded-lg p-3 text-left transition-all ${
                            onAttributeClick
                              ? 'cursor-pointer hover:border-accent-purple hover:bg-accent-purple/10 active:scale-95'
                              : 'cursor-default'
                          }`}
                        >
                          <p className="text-xs text-gray-500 uppercase tracking-wide">{attr.trait_type}</p>
                          <p className="text-sm font-medium text-gray-200 mt-0.5">{attr.value}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
