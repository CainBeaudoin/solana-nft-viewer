import { useState, useCallback } from 'react';
import { NFTData, TraitIndex } from '../types/nft';
import {
  fetchCollectionWithInfo,
  buildTraitIndex,
  isValidSolanaAddress,
  CollectionData
} from '../utils/metaplex';

interface UseCollectionResult {
  nfts: NFTData[];
  traitIndex: TraitIndex;
  collectionInfo: CollectionData | null;
  loading: boolean;
  error: string | null;
  progress: { loaded: number; total: number } | null;
  fetchCollection: (address: string, apiKey: string, network?: 'devnet' | 'mainnet') => Promise<void>;
}

export function useCollection(): UseCollectionResult {
  const [nfts, setNfts] = useState<NFTData[]>([]);
  const [traitIndex, setTraitIndex] = useState<TraitIndex>({});
  const [collectionInfo, setCollectionInfo] = useState<CollectionData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<{ loaded: number; total: number } | null>(null);

  const fetchCollection = useCallback(async (
    address: string,
    apiKey: string,
    network: 'devnet' | 'mainnet' = 'devnet'
  ) => {
    // Validate inputs
    if (!apiKey || apiKey.trim() === '') {
      setError('Please enter your API key');
      return;
    }

    if (!address || address.trim() === '') {
      setError('Please enter a collection address');
      return;
    }

    if (!isValidSolanaAddress(address)) {
      setError('Invalid Solana address format');
      return;
    }

    setLoading(true);
    setError(null);
    setNfts([]);
    setTraitIndex({});
    setCollectionInfo(null);
    setProgress(null);

    try {
      // Fetch collection + assets using DAS API
      const result = await fetchCollectionWithInfo(
        address,
        apiKey,
        network,
        (loaded, total) => setProgress({ loaded, total })
      );

      if (result.assets.length === 0) {
        setError(
          'No NFTs found in this collection. ' +
          'Make sure this is a valid Metaplex Core collection address.'
        );
        return;
      }

      const index = buildTraitIndex(result.assets);

      setCollectionInfo(result.collection);
      setNfts(result.assets);
      setTraitIndex(index);
    } catch (err) {
      let message = err instanceof Error ? err.message : 'Failed to fetch collection';

      // Provide helpful error messages
      if (message.includes('Invalid API Key') || message.includes('401')) {
        message = 'Invalid API Key. Please check your Helius API key and try again.';
      } else if (message.includes('fetch') || message.includes('network')) {
        message = 'Network error. Please check your internet connection and try again.';
      }

      setError(message);
    } finally {
      setLoading(false);
      setProgress(null);
    }
  }, []);

  return { nfts, traitIndex, collectionInfo, loading, error, progress, fetchCollection };
}
