import { useState } from 'react';
import { motion } from 'framer-motion';

interface SettingsViewProps {
  rpcUrl: string;
  onRpcUrlChange: (url: string) => void;
}

const RPC_PRESETS = [
  { name: 'Solana Mainnet', url: 'https://api.mainnet-beta.solana.com' },
  { name: 'Helius (Free)', url: 'https://mainnet.helius-rpc.com/?api-key=YOUR_API_KEY' },
  { name: 'QuickNode', url: 'https://your-quicknode-endpoint.quiknode.pro/' },
  { name: 'Alchemy', url: 'https://solana-mainnet.g.alchemy.com/v2/YOUR_API_KEY' },
];

export function SettingsView({ rpcUrl, onRpcUrlChange }: SettingsViewProps) {
  const [customRpc, setCustomRpc] = useState(rpcUrl || '');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    onRpcUrlChange(customRpc);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handlePresetClick = (url: string) => {
    setCustomRpc(url);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-gray-500">Configure your NFT viewer preferences</p>
      </div>

      {/* RPC Configuration */}
      <div className="bg-dark-surface border border-dark-border rounded-2xl overflow-hidden mb-6">
        <div className="p-5 border-b border-dark-border">
          <h2 className="text-lg font-semibold text-white">RPC Endpoint</h2>
          <p className="text-sm text-gray-500 mt-1">
            Configure a custom RPC endpoint for better performance and reliability
          </p>
        </div>
        <div className="p-5">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Custom RPC URL
              </label>
              <input
                type="text"
                value={customRpc}
                onChange={(e) => setCustomRpc(e.target.value)}
                placeholder="https://api.mainnet-beta.solana.com"
                className="w-full bg-dark-card border border-dark-border rounded-xl px-4 py-3 text-sm text-gray-200 placeholder-gray-600 focus:border-gray-600 transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Presets
              </label>
              <div className="grid grid-cols-2 gap-2">
                {RPC_PRESETS.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => handlePresetClick(preset.url)}
                    className="px-4 py-2.5 bg-dark-card border border-dark-border rounded-lg text-sm text-gray-400 hover:text-white hover:border-gray-600 transition-colors text-left"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            <motion.button
              onClick={handleSave}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full px-6 py-3 bg-white text-dark-bg font-semibold rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
            >
              {saved ? (
                <>
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Saved
                </>
              ) : (
                'Save Changes'
              )}
            </motion.button>
          </div>
        </div>
      </div>

      {/* About */}
      <div className="bg-dark-surface border border-dark-border rounded-2xl overflow-hidden mb-6">
        <div className="p-5 border-b border-dark-border">
          <h2 className="text-lg font-semibold text-white">About</h2>
        </div>
        <div className="p-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-400">Version</span>
              <span className="text-gray-200 font-mono">0.0.1</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-400">Network</span>
              <span className="text-gray-200">Solana Mainnet</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-400">Built with</span>
              <span className="text-gray-200">React + Metaplex</span>
            </div>
          </div>
        </div>
      </div>

      {/* Keyboard Shortcuts */}
      <div className="bg-dark-surface border border-dark-border rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-dark-border">
          <h2 className="text-lg font-semibold text-white">Keyboard Shortcuts</h2>
        </div>
        <div className="p-5">
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-400">Focus search</span>
              <div className="flex items-center gap-1">
                <kbd className="px-2 py-1 text-xs font-medium text-gray-400 bg-dark-card rounded border border-dark-border">
                  Ctrl
                </kbd>
                <span className="text-gray-600">+</span>
                <kbd className="px-2 py-1 text-xs font-medium text-gray-400 bg-dark-card rounded border border-dark-border">
                  K
                </kbd>
              </div>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-gray-400">Clear search</span>
              <kbd className="px-2 py-1 text-xs font-medium text-gray-400 bg-dark-card rounded border border-dark-border">
                Esc
              </kbd>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
