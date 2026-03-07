import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useCollection } from './hooks/useCollection';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { CollectionInput } from './components/CollectionInput';
import { TraitFilter } from './components/TraitFilter';
import { NFTGrid } from './components/NFTGrid';
import { LoadingSpinner } from './components/LoadingSpinner';
import { AnalyticsView } from './components/views/AnalyticsView';
import { RarityView } from './components/views/RarityView';
import { ExplorerView } from './components/views/ExplorerView';
import { MarketView } from './components/views/MarketView';
import { SettingsView } from './components/views/SettingsView';
import { SelectedTrait, SortOption } from './types/nft';
import { ViewType } from './types/navigation';
import { calculateRarityScore } from './utils/metaplex';

function App() {
  const { nfts, traitIndex, loading, error, progress, fetchCollection } = useCollection();
  const [selectedTraits, setSelectedTraits] = useState<SelectedTrait[]>([]);
  const [sortOption, setSortOption] = useState<SortOption>('rarity-desc');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeView, setActiveView] = useState<ViewType>('collection');
  const [rpcUrl, setRpcUrl] = useState('');

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

  const handleLoadCollection = (address: string) => {
    fetchCollection(address, rpcUrl || undefined);
    setActiveView('collection');
  };

  const handleLoadWallet = (address: string) => {
    // For wallet loading, we use the same fetch but it will detect wallet addresses
    fetchCollection(address, rpcUrl || undefined);
    setActiveView('collection');
  };

  const filteredAndSortedNfts = useMemo(() => {
    let result = nfts;

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter((nft) =>
        nft.name.toLowerCase().includes(query) ||
        nft.mint.toLowerCase().includes(query) ||
        nft.attributes.some(
          (attr) =>
            attr.trait_type.toLowerCase().includes(query) ||
            attr.value.toLowerCase().includes(query)
        )
      );
    }

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
  }, [nfts, selectedTraits, sortOption, traitIndex, searchQuery]);

  const renderCollectionView = () => (
    <>
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-white mb-2">Collection Explorer</h1>
        <p className="text-gray-500">
          Discover and analyze NFT collections on Solana
        </p>
      </motion.div>

      {/* Collection Input */}
      <div className="mb-8">
        <CollectionInput onSubmit={handleLoadCollection} loading={loading} />
      </div>

      {/* Error State */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl"
        >
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        </motion.div>
      )}

      {/* Loading State */}
      {loading && <LoadingSpinner progress={progress} />}

      {/* NFT Display */}
      {!loading && nfts.length > 0 && (
        <div className="flex flex-col lg:flex-row gap-6">
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
          <div className="flex-1 min-w-0">
            {/* Stats Bar */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center gap-6 mb-6"
            >
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-accent-green"></div>
                <span className="text-sm text-gray-400">
                  {filteredAndSortedNfts.length} NFTs
                </span>
              </div>
              <div className="text-sm text-gray-600">
                {Object.keys(traitIndex).length} trait types
              </div>
            </motion.div>

            <NFTGrid nfts={filteredAndSortedNfts} traitIndex={traitIndex} />
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && nfts.length === 0 && !error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center justify-center py-20"
        >
          <div className="w-20 h-20 rounded-2xl bg-dark-surface border border-dark-border flex items-center justify-center mb-6">
            <svg className="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-white mb-2">No Collection Loaded</h3>
          <p className="text-gray-500 text-center max-w-md">
            Enter a Solana NFT collection address above to explore NFTs, view traits, and analyze rarity.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <span className="px-3 py-1.5 bg-dark-surface border border-dark-border rounded-lg text-xs text-gray-500">
              Mad Lads
            </span>
            <span className="px-3 py-1.5 bg-dark-surface border border-dark-border rounded-lg text-xs text-gray-500">
              Claynosaurz
            </span>
            <span className="px-3 py-1.5 bg-dark-surface border border-dark-border rounded-lg text-xs text-gray-500">
              DeGods
            </span>
          </div>
        </motion.div>
      )}
    </>
  );

  const renderActiveView = () => {
    switch (activeView) {
      case 'collection':
        return renderCollectionView();
      case 'explorer':
        return (
          <ExplorerView
            onLoadCollection={handleLoadCollection}
            onLoadWallet={handleLoadWallet}
            loading={loading}
          />
        );
      case 'analytics':
        return <AnalyticsView nfts={nfts} traitIndex={traitIndex} />;
      case 'rarity':
        return <RarityView nfts={nfts} traitIndex={traitIndex} />;
      case 'market':
        return <MarketView nfts={nfts} />;
      case 'settings':
        return <SettingsView rpcUrl={rpcUrl} onRpcUrlChange={setRpcUrl} />;
      default:
        return renderCollectionView();
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg">
      <Navbar onSearch={setSearchQuery} searchQuery={searchQuery} hasResults={nfts.length > 0} />
      <Sidebar activeView={activeView} onViewChange={setActiveView} />

      {/* Main Content */}
      <main className="pt-16 pl-16">
        <div className="p-6">
          {renderActiveView()}
        </div>
      </main>
    </div>
  );
}

export default App;
