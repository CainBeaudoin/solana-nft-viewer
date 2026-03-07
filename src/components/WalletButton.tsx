import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';

export function WalletButton() {
  const { publicKey, wallet, disconnect, connecting } = useWallet();
  const { setVisible } = useWalletModal();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const truncatedAddress = publicKey
    ? `${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}`
    : '';

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const copyAddress = () => {
    if (publicKey) {
      navigator.clipboard.writeText(publicKey.toBase58());
      setShowDropdown(false);
    }
  };

  if (!publicKey) {
    return (
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setVisible(true)}
        disabled={connecting}
        className="px-4 py-2 bg-white text-dark-bg text-sm font-semibold rounded-lg hover:bg-gray-100 disabled:bg-gray-700 disabled:text-gray-400 transition-colors flex items-center gap-2"
      >
        {connecting ? (
          <>
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Connecting
          </>
        ) : (
          'Connect Wallet'
        )}
      </motion.button>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center gap-2 px-3 py-2 bg-dark-surface border border-dark-border rounded-lg hover:border-gray-600 transition-colors"
      >
        {wallet?.adapter.icon && (
          <img src={wallet.adapter.icon} alt={wallet.adapter.name} className="w-5 h-5" />
        )}
        <span className="text-sm font-medium text-gray-300">{truncatedAddress}</span>
        <svg
          className={`w-4 h-4 text-gray-500 transition-transform ${showDropdown ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </motion.button>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-48 bg-dark-surface border border-dark-border rounded-xl overflow-hidden shadow-xl z-50"
          >
            <div className="p-3 border-b border-dark-border">
              <p className="text-xs text-gray-500">Connected with</p>
              <p className="text-sm font-medium text-white">{wallet?.adapter.name}</p>
            </div>
            <div className="p-1">
              <button
                onClick={copyAddress}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:bg-dark-hover rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy Address
              </button>
              <button
                onClick={() => setVisible(true)}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:bg-dark-hover rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                </svg>
                Change Wallet
              </button>
              <button
                onClick={() => {
                  disconnect();
                  setShowDropdown(false);
                }}
                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:bg-dark-hover rounded-lg transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Disconnect
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
