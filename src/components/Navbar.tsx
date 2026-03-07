import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NavbarProps {
  apiKey: string;
  onApiKeyChange: (key: string) => void;
  isApiKeyValid: boolean;
}

export function Navbar({ apiKey, onApiKeyChange, isApiKeyValid }: NavbarProps) {
  const [isExpanded, setIsExpanded] = useState(!apiKey);
  const [localKey, setLocalKey] = useState(apiKey);

  // Auto-collapse when valid key is entered
  useEffect(() => {
    if (apiKey && isApiKeyValid) {
      setIsExpanded(false);
    }
  }, [apiKey, isApiKeyValid]);

  const handleKeySubmit = () => {
    onApiKeyChange(localKey);
    if (localKey) {
      setIsExpanded(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleKeySubmit();
    }
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="fixed top-0 left-0 right-0 z-50 bg-dark-bg border-b border-dark-border"
    >
      <div className="flex items-center justify-between h-14 px-4">
        {/* Left - Logo */}
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-accent-purple to-accent-blue flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <span className="text-lg font-bold text-white tracking-tight">
            CainWorld
          </span>
        </div>

        {/* Right - API Key */}
        <div className="flex items-center">
          <AnimatePresence mode="wait">
            {isExpanded ? (
              <motion.div
                key="expanded"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="flex items-center gap-2"
              >
                <div className="relative">
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                  <input
                    type="password"
                    value={localKey}
                    onChange={(e) => setLocalKey(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onBlur={handleKeySubmit}
                    placeholder="Enter API Key"
                    className="w-48 bg-dark-surface border border-dark-border rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-gray-500 focus:border-accent-purple focus:ring-1 focus:ring-accent-purple transition-colors"
                    autoFocus
                  />
                </div>
                <button
                  onClick={handleKeySubmit}
                  className="p-1.5 bg-accent-purple hover:bg-accent-purple/80 rounded-lg transition-colors"
                >
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </button>
              </motion.div>
            ) : (
              <motion.button
                key="collapsed"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                onClick={() => setIsExpanded(true)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors ${
                  apiKey && isApiKeyValid
                    ? 'bg-accent-green/10 border-accent-green/30 text-accent-green'
                    : 'bg-dark-surface border-dark-border text-gray-400 hover:border-gray-600'
                }`}
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                </svg>
                <span className="text-xs font-medium">
                  {apiKey && isApiKeyValid ? 'API ✓' : 'API Key'}
                </span>
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.header>
  );
}
