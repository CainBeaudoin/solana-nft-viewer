import { useState } from 'react';
import { motion } from 'framer-motion';
import { useWallet } from '@solana/wallet-adapter-react';
import { isValidSolanaAddress } from '../../utils/metaplex';

interface ExplorerViewProps {
  onLoadCollection: (address: string) => void;
  onLoadWallet: (address: string) => void;
  loading: boolean;
}

const POPULAR_COLLECTIONS = [
  { name: 'Mad Lads', address: 'J1S9H3QjnRtBbbuD4HjPV6RpRhwuk4zKbxsnCHuTgh9w' },
  { name: 'Claynosaurz', address: 'BkPSJ4wQ9XPGFBcXwnqPK8XgUPnUYYhYLr3CnUMa7qGP' },
  { name: 'Famous Fox Federation', address: 'BUjZjAS2vbbb65g7Z1Ca9ZRVYoJscURG5L3AkVvHP9ac' },
  { name: 'Okay Bears', address: '3saAedkM9o5g1u5DCqsuMZuC4GRqPB4TuMkvSsSVvGQ3' },
];

export function ExplorerView({ onLoadCollection, onLoadWallet, loading }: ExplorerViewProps) {
  const { publicKey } = useWallet();
  const [address, setAddress] = useState('');
  const [searchType, setSearchType] = useState<'collection' | 'wallet'>('collection');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.trim()) {
      setError('Please enter an address');
      return;
    }
    if (!isValidSolanaAddress(address.trim())) {
      setError('Invalid Solana address');
      return;
    }
    setError('');
    if (searchType === 'collection') {
      onLoadCollection(address.trim());
    } else {
      onLoadWallet(address.trim());
    }
  };

  const handleQuickLoad = (addr: string) => {
    setAddress(addr);
    onLoadCollection(addr);
  };

  const handleLoadMyWallet = () => {
    if (publicKey) {
      setAddress(publicKey.toBase58());
      setSearchType('wallet');
      onLoadWallet(publicKey.toBase58());
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Explorer</h1>
        <p className="text-gray-500">Search collections or view wallet NFTs</p>
      </div>

      {/* Search Section */}
      <div className="bg-dark-surface border border-dark-border rounded-2xl p-6 mb-8">
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setSearchType('collection')}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              searchType === 'collection'
                ? 'bg-white text-dark-bg'
                : 'bg-dark-card text-gray-400 hover:text-white'
            }`}
          >
            Collection
          </button>
          <button
            onClick={() => setSearchType('wallet')}
            className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              searchType === 'wallet'
                ? 'bg-white text-dark-bg'
                : 'bg-dark-card text-gray-400 hover:text-white'
            }`}
          >
            Wallet
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="text"
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
                setError('');
              }}
              placeholder={searchType === 'collection' ? 'Enter collection address...' : 'Enter wallet address...'}
              className="w-full bg-dark-card border border-dark-border rounded-xl px-4 py-3 text-sm text-gray-200 placeholder-gray-600 focus:border-gray-600 transition-colors"
              disabled={loading}
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          <div className="flex gap-3">
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 px-6 py-3 bg-white text-dark-bg font-semibold rounded-xl hover:bg-gray-100 disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Loading
                </span>
              ) : (
                `Load ${searchType === 'collection' ? 'Collection' : 'Wallet'}`
              )}
            </motion.button>

            {publicKey && searchType === 'wallet' && (
              <motion.button
                type="button"
                onClick={handleLoadMyWallet}
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3 bg-dark-card border border-dark-border text-gray-300 font-medium rounded-xl hover:bg-dark-hover disabled:opacity-50 transition-colors"
              >
                My Wallet
              </motion.button>
            )}
          </div>
        </form>
      </div>

      {/* Popular Collections */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Popular Collections</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {POPULAR_COLLECTIONS.map((collection, index) => (
            <motion.button
              key={collection.address}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => handleQuickLoad(collection.address)}
              disabled={loading}
              className="bg-dark-surface border border-dark-border rounded-xl p-5 text-left hover:border-gray-600 disabled:opacity-50 transition-colors group"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-white group-hover:text-accent-green transition-colors">
                    {collection.name}
                  </h3>
                  <p className="text-xs text-gray-600 font-mono mt-1">
                    {collection.address.slice(0, 12)}...{collection.address.slice(-8)}
                  </p>
                </div>
                <svg
                  className="w-5 h-5 text-gray-600 group-hover:text-accent-green transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="mt-8 p-5 bg-dark-surface/50 border border-dark-border rounded-xl">
        <h3 className="text-sm font-semibold text-gray-400 mb-3">Tips</h3>
        <ul className="space-y-2 text-sm text-gray-500">
          <li className="flex items-start gap-2">
            <span className="text-accent-green">-</span>
            <span>Use the Collection tab to explore NFT collections by their mint address</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent-green">-</span>
            <span>Use the Wallet tab to view all NFTs owned by a specific wallet</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-accent-green">-</span>
            <span>Connect your wallet and click "My Wallet" to quickly view your NFTs</span>
          </li>
        </ul>
      </div>
    </motion.div>
  );
}
