import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useCollection } from './hooks/useCollection';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { TraitFilter } from './components/TraitFilter';
import { NFTGrid } from './components/NFTGrid';
import { LoadingSpinner } from './components/LoadingSpinner';
import { RarityView } from './components/views/RarityView';
import { SelectedTrait, SortOption } from './types/nft';
import { ViewType } from './types/navigation';
import { calculateRarityScore } from './utils/metaplex';

function App() {
  const { nfts, traitIndex, collectionInfo, loading, error, progress, fetchCollection } = useCollection();
  const [selectedTraits, setSelectedTraits] = useState<SelectedTrait[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>('rarity-desc');
  const [activeView, setActiveView] = useState<ViewType>('collection');

  // Form state
  const [apiKey, setApiKey] = useState('');
  const [collectionAddress, setCollectionAddress] = useState('');

  // API key is considered valid if it's not empty and we haven't had an API key error
  const isApiKeyValid = apiKey.length > 0 && (!error || !error.toLowerCase().includes('api key'));

  const handleTraitToggle = (traitType: string, value: string) => {
    setSelectedTraits((prev) => {
      const exists = prev.some(
        (t) => t.traitType === traitType && t.value === value
      );
      if (exists) {
        return prev.filter(
          (t) => !(t.traitType === traitType && t.value === value)
        );
      }
      return [...prev, { traitType, value }];
    });
  };

  const handleClearFilters = () => {
    setSelectedTraits([]);
  };

  const handleFetch = () => {
    if (collectionAddress && apiKey) {
      fetchCollection(collectionAddress, apiKey, 'mainnet');
      setActiveView('collection');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleFetch();
    }
  };

  const filteredAndSortedNfts = useMemo(() => {
    let result = nfts;

    // Filter by selected traits
    if (selectedTraits.length > 0) {
      result = result.filter((nft) =>
        selectedTraits.every(({ traitType, value }) =>
          nft.attributes.some(
            (attr) => attr.trait_type === traitType && attr.value === value
          )
        )
      );
    }

    // Sort
    result = [...result].sort((a, b) => {
      switch (sortOption) {
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        case 'rarity-desc': {
          const scoreA = calculateRarityScore(a, traitIndex, nfts.length);
          const scoreB = calculateRarityScore(b, traitIndex, nfts.length);
          return scoreB - scoreA;
        }
        case 'rarity-asc': {
          const scoreA = calculateRarityScore(a, traitIndex, nfts.length);
          const scoreB = calculateRarityScore(b, traitIndex, nfts.length);
          return scoreA - scoreB;
        }
        default:
          return 0;
      }
    });

    return result;
  }, [nfts, selectedTraits, sortOption, traitIndex]);

  const renderCollectionView = () => (
    <>
      {/* Header with Title */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6 text-center"
      >
        <h1 className="text-2xl font-bold text-white">Binder Gallery</h1>
      </motion.div>

      {/* Centered Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="mb-6 max-w-2xl mx-auto"
      >
        <div className="relative">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={collectionAddress}
            onChange={(e) => setCollectionAddress(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Input Collection CA"
            className="w-full bg-dark-surface border border-dark-border rounded-xl pl-12 pr-4 py-3.5 text-sm text-white placeholder-gray-500 font-mono focus:border-accent-purple focus:ring-1 focus:ring-accent-purple transition-colors"
          />
          {loading && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <svg className="w-5 h-5 animate-spin text-accent-purple" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
          )}
        </div>
        {!apiKey && collectionAddress && (
          <p className="text-xs text-yellow-500 text-center mt-2">
            Enter your API key in the top-right corner, then press Enter
          </p>
        )}
      </motion.div>

      {/* Error State */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-5 p-3 bg-red-500/10 border border-red-500/20 rounded-lg max-w-2xl mx-auto"
        >
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        </motion.div>
      )}

      {/* Loading State */}
      {loading && <LoadingSpinner progress={progress} />}

      {/* Collection Info Card */}
      {!loading && collectionInfo && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-5 p-4 bg-dark-surface border border-dark-border rounded-xl"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Name</p>
              <p className="text-sm text-white font-medium truncate">{collectionInfo.name}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Minted</p>
              <p className="text-sm text-white font-medium">{collectionInfo.numMinted}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Current Size</p>
              <p className="text-sm text-white font-medium">{collectionInfo.currentSize}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500 mb-0.5">Update Authority</p>
              <p className="text-sm text-white font-mono truncate" title={collectionInfo.updateAuthority}>
                {collectionInfo.updateAuthority.slice(0, 8)}...
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* NFT Display - Two Column Layout */}
      {!loading && nfts.length > 0 && (
        <div className="flex flex-col lg:flex-row gap-5">
          {/* Left Column - Filters */}
          <TraitFilter
            traitIndex={traitIndex}
            selectedTraits={selectedTraits}
            onTraitToggle={handleTraitToggle}
            onClearFilters={handleClearFilters}
            sortOption={sortOption}
            onSortChange={setSortOption}
            totalCount={nfts.length}
            filteredCount={filteredAndSortedNfts.length}
          />

          {/* Right Column - Selected Chips + NFT Grid */}
          <div className="flex-1 min-w-0">
            {/* Selected Attribute Chips - Above Grid */}
            {selectedTraits.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-dark-surface border border-dark-border rounded-xl"
              >
                <div className="flex flex-wrap items-center gap-2">
                  {selectedTraits.map((trait, index) => (
                    <motion.button
                      key={`${trait.traitType}-${trait.value}`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: index * 0.02 }}
                      onClick={() => handleTraitToggle(trait.traitType, trait.value)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-dark-card hover:bg-dark-hover border border-dark-border rounded-full text-sm transition-colors group"
                    >
                      <span className="text-gray-400">{trait.traitType}:</span>
                      <span className="text-white font-medium">{trait.value}</span>
                      <svg
                        className="w-3.5 h-3.5 text-gray-500 group-hover:text-red-400 transition-colors ml-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </motion.button>
                  ))}
                  <button
                    onClick={handleClearFilters}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs text-gray-400 hover:text-white hover:bg-dark-hover rounded-full transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Clear all
                  </button>
                </div>
              </motion.div>
            )}

            {/* Stats Bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-4 mb-4"
            >
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-accent-green"></div>
                <span className="text-xs text-gray-400">
                  {filteredAndSortedNfts.length} NFTs
                </span>
              </div>
              <div className="text-xs text-gray-600">
                {Object.keys(traitIndex).length} traits
              </div>
            </motion.div>

            {/* NFT Grid */}
            <NFTGrid
              nfts={filteredAndSortedNfts}
              traitIndex={traitIndex}
              onAttributeClick={handleTraitToggle}
            />
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && nfts.length === 0 && !error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center justify-center py-16"
        >
          <div className="w-16 h-16 rounded-2xl bg-dark-surface border border-dark-border flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-base font-semibold text-white mb-1">Ready to Load</h3>
          <p className="text-gray-500 text-sm text-center max-w-sm">
            Enter your API key and collection address, then press Enter.
          </p>
        </motion.div>
      )}
    </>
  );

  const renderActiveView = () => {
    switch (activeView) {
      case 'collection':
        return renderCollectionView();
      case 'rarity':
        return <RarityView nfts={nfts} traitIndex={traitIndex} />;
      default:
        return renderCollectionView();
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg">
      <Navbar
        apiKey={apiKey}
        onApiKeyChange={setApiKey}
        isApiKeyValid={isApiKeyValid && nfts.length > 0}
      />
      <Sidebar activeView={activeView} onViewChange={setActiveView} />

      {/* Main Content */}
      <main className="pt-14 pl-16">
        <div className="p-5">
          {renderActiveView()}
        </div>
      </main>
    </div>
  );
}

export default App;
