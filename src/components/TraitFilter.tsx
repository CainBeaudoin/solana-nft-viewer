import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TraitIndex, SelectedTrait, SortOption } from '../types/nft';

interface TraitFilterProps {
  traitIndex: TraitIndex;
  selectedTraits: SelectedTrait[];
  onTraitToggle: (traitType: string, value: string) => void;
  onClearFilters: () => void;
  sortOption: SortOption;
  onSortChange: (option: SortOption) => void;
  totalCount: number;
  filteredCount: number;
}

export function TraitFilter({
  traitIndex,
  selectedTraits,
  onTraitToggle,
  onClearFilters,
  sortOption,
  onSortChange,
  totalCount,
  filteredCount,
}: TraitFilterProps) {
  const [expandedTraits, setExpandedTraits] = useState<Set<string>>(new Set());

  const toggleExpanded = (traitType: string) => {
    setExpandedTraits((prev) => {
      const next = new Set(prev);
      if (next.has(traitType)) {
        next.delete(traitType);
      } else {
        next.add(traitType);
      }
      return next;
    });
  };

  const isSelected = (traitType: string, value: string) => {
    return selectedTraits.some(
      (t) => t.traitType === traitType && t.value === value
    );
  };

  const traitTypes = Object.keys(traitIndex).sort();

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full lg:w-72 flex-shrink-0"
    >
      <div className="bg-dark-surface border border-dark-border rounded-2xl sticky top-20">
        {/* Header */}
        <div className="p-4 border-b border-dark-border">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-white">Filters</h2>
            {selectedTraits.length > 0 && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={onClearFilters}
                className="text-xs text-gray-400 hover:text-white transition-colors"
              >
                Clear all
              </motion.button>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {filteredCount === totalCount ? (
              `${totalCount} items`
            ) : (
              <span>
                <span className="text-white font-medium">{filteredCount}</span>
                {' '}of {totalCount} items
              </span>
            )}
          </p>
        </div>

        {/* Sort */}
        <div className="p-4 border-b border-dark-border">
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
            Sort by
          </label>
          <select
            value={sortOption}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
            className="w-full bg-dark-card border border-dark-border rounded-lg px-3 py-2 text-sm text-gray-300 focus:border-gray-600 transition-colors cursor-pointer"
          >
            <option value="name-asc">Name (A-Z)</option>
            <option value="name-desc">Name (Z-A)</option>
            <option value="rarity-desc">Rarity (Highest)</option>
            <option value="rarity-asc">Rarity (Lowest)</option>
          </select>
        </div>

        {/* Traits */}
        <div className="p-4">
          <label className="block text-xs font-medium text-gray-500 uppercase tracking-wide mb-3">
            Attributes
          </label>
          <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
            {traitTypes.map((traitType) => (
              <div
                key={traitType}
                className="bg-dark-card border border-dark-border rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => toggleExpanded(traitType)}
                  className="w-full flex items-center justify-between p-3 hover:bg-dark-hover transition-colors"
                >
                  <span className="text-sm font-medium text-gray-300">
                    {traitType}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-600">
                      {Object.keys(traitIndex[traitType]).length}
                    </span>
                    <svg
                      className={`w-4 h-4 text-gray-500 transition-transform ${
                        expandedTraits.has(traitType) ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>

                <AnimatePresence>
                  {expandedTraits.has(traitType) && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-3 pb-3 space-y-1 max-h-48 overflow-y-auto">
                        {Object.entries(traitIndex[traitType])
                          .sort(([, a], [, b]) => b - a)
                          .map(([value, count]) => {
                            const selected = isSelected(traitType, value);
                            return (
                              <label
                                key={value}
                                className={`flex items-center gap-3 cursor-pointer p-2 rounded-lg transition-colors ${
                                  selected
                                    ? 'bg-white/5'
                                    : 'hover:bg-dark-hover'
                                }`}
                              >
                                <div
                                  className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                                    selected
                                      ? 'bg-white border-white'
                                      : 'border-gray-600 hover:border-gray-500'
                                  }`}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    onTraitToggle(traitType, value);
                                  }}
                                >
                                  {selected && (
                                    <svg className="w-2.5 h-2.5 text-dark-bg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                    </svg>
                                  )}
                                </div>
                                <span className={`text-sm flex-1 truncate ${selected ? 'text-white' : 'text-gray-400'}`}>
                                  {value}
                                </span>
                                <span className="text-xs text-gray-600 tabular-nums">{count}</span>
                              </label>
                            );
                          })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
