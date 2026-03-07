import { motion } from 'framer-motion';
import { useWallet } from '@solana/wallet-adapter-react';
import { useRef, useEffect } from 'react';
import { WalletButton } from './WalletButton';

interface NavbarProps {
  onSearch?: (query: string) => void;
  searchQuery?: string;
  hasResults?: boolean;
}

export function Navbar({ onSearch, searchQuery = '', hasResults = false }: NavbarProps) {
  const { publicKey } = useWallet();
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === 'Escape' && document.activeElement === searchInputRef.current) {
        searchInputRef.current?.blur();
        onSearch?.('');
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onSearch]);

  const handleClear = () => {
    onSearch?.('');
    searchInputRef.current?.focus();
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-0 right-0 z-50 bg-dark-bg border-b border-dark-border"
    >
      <div className="flex items-center justify-between h-16 px-6">
        {/* Left - Logo */}
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold text-white tracking-tight">
            SOLANA<span className="text-accent-muted">NFT</span>
          </span>
        </div>

        {/* Center - Search */}
        <div className="flex-1 max-w-xl mx-8">
          <div className="relative group">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-gray-400 transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              placeholder={hasResults ? "Search NFTs by name, trait, or address..." : "Load a collection to search..."}
              onChange={(e) => onSearch?.(e.target.value)}
              disabled={!hasResults}
              className="w-full bg-dark-surface border border-dark-border rounded-lg pl-10 pr-20 py-2.5 text-sm text-gray-300 placeholder-gray-500 focus:border-gray-600 focus:ring-1 focus:ring-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {searchQuery ? (
                <button
                  onClick={handleClear}
                  className="p-1 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              ) : (
                <div className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 text-[10px] font-medium text-gray-500 bg-dark-card rounded border border-dark-border">
                    Ctrl
                  </kbd>
                  <kbd className="px-1.5 py-0.5 text-[10px] font-medium text-gray-500 bg-dark-card rounded border border-dark-border">
                    K
                  </kbd>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right - Controls */}
        <div className="flex items-center gap-4">
          {/* Connection Status */}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-dark-surface rounded-lg border border-dark-border">
            <div className={`w-2 h-2 rounded-full ${publicKey ? 'bg-accent-green' : 'bg-gray-500'}`}></div>
            <span className="text-xs font-medium text-gray-400">
              {publicKey ? 'Connected' : 'Not Connected'}
            </span>
          </div>

          {/* Wallet Button */}
          <WalletButton />

          {/* Profile Avatar */}
          <div className="w-9 h-9 rounded-full bg-dark-card border border-dark-border flex items-center justify-center">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
