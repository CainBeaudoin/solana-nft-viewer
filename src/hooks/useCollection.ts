import { useState, useCallback } from 'react';
import { NFTData, TraitIndex } from '../types/nft';
import { createMetaplex, fetchCollectionNFTs, buildTraitIndex, isValidSolanaAddress } from '../utils/metaplex';

interface UseCollectionResult {
  nfts: NFTData[];
  traitIndex: TraitIndex;
  loading: boolean;
  error: string | null;
  progress: { loaded: number; total: number } | null;
  fetchCollection: (address: string, rpcUrl?: string) => Promise<void>;
}

export function useCollection(): UseCollectionResult {
  const [nfts, setNfts] = useState<NFTData[]>([]);
  const [traitIndex, setTraitIndex] = useState<TraitIndex>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<{ loaded: number; total: number } | null>(null);

  const fetchCollection = useCallback(async (address: string, rpcUrl?: string) => {
    if (!isValidSolanaAddress(address)) {
      setError('Invalid Solana address format');
      return;
    }

    setLoading(true);
    setError(null);
    setNfts([]);
    setTraitIndex({});
    setProgress(null);

    try {
      const metaplex = createMetaplex(rpcUrl);

      const fetchedNfts = await fetchCollectionNFTs(
        metaplex,
        address,
        (loaded, total) => setProgress({ loaded, total })
      );

      if (fetchedNfts.length === 0) {
        setError('No NFTs found in this collection. Make sure this is a valid collection address.');
        return;
      }

      const index = buildTraitIndex(fetchedNfts);

      setNfts(fetchedNfts);
      setTraitIndex(index);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch collection';
      setError(message);
    } finally {
      setLoading(false);
      setProgress(null);
    }
  }, []);

  return { nfts, traitIndex, loading, error, progress, fetchCollection };
}
