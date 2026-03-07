import { useState } from 'react';
import { motion } from 'framer-motion';
import { isValidSolanaAddress } from '../utils/metaplex';

interface CollectionInputProps {
  onSubmit: (address: string, rpcUrl?: string) => void;
  loading: boolean;
}

export function CollectionInput({ onSubmit, loading }: CollectionInputProps) {
  const [address, setAddress] = useState('');
  const [rpcUrl, setRpcUrl] = useState('');
  const [showRpc, setShowRpc] = useState(false);
  const [validationError, setValidationError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!address.trim()) {
      setValidationError('Please enter a collection address');
      return;
    }

    if (!isValidSolanaAddress(address.trim())) {
      setValidationError('Invalid Solana address format');
      return;
    }

    setValidationError('');
    onSubmit(address.trim(), rpcUrl.trim() || undefined);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="w-full"
    >
      <div className="bg-dark-surface border border-dark-border rounded-2xl p-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-white">Load Collection</h2>
          <p className="text-sm text-gray-500 mt-1">Enter a Solana NFT collection address to explore</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-3">
            <input
              type="text"
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
                setValidationError('');
              }}
              placeholder="Collection mint address..."
              className="flex-1 bg-dark-card border border-dark-border rounded-xl px-4 py-3 text-sm text-gray-200 placeholder-gray-600 focus:border-gray-600 transition-colors"
              disabled={loading}
            />
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 bg-white text-dark-bg font-semibold rounded-xl hover:bg-gray-100 disabled:bg-gray-700 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Loading
                </span>
              ) : (
                'Fetch'
              )}
            </motion.button>
          </div>

          {validationError && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-400 text-sm"
            >
              {validationError}
            </motion.p>
          )}

          <button
            type="button"
            onClick={() => setShowRpc(!showRpc)}
            className="text-sm text-gray-500 hover:text-gray-400 flex items-center gap-1 transition-colors"
          >
            <svg
              className={`w-3 h-3 transition-transform ${showRpc ? 'rotate-90' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            Advanced Settings
          </button>

          {showRpc && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <input
                type="text"
                value={rpcUrl}
                onChange={(e) => setRpcUrl(e.target.value)}
                placeholder="Custom RPC URL (optional)"
                className="w-full bg-dark-card border border-dark-border rounded-xl px-4 py-2.5 text-sm text-gray-200 placeholder-gray-600 focus:border-gray-600 transition-colors"
                disabled={loading}
              />
            </motion.div>
          )}
        </form>
      </div>
    </motion.div>
  );
}
