import { PublicKey } from '@solana/web3.js';
import { fetchCollectionData, buildRpcEndpoint, CollectionData } from './fetchCollectionData';
import { fetchAssetsByCollectionDAS, CoreAsset } from './fetchAssetsByCollection';
import { NFTData, NFTAttribute, TraitIndex } from '../types/nft';

export function isValidSolanaAddress(address: string): boolean {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
}

export interface CollectionResult {
  collection: CollectionData | null;
  assets: NFTData[];
}

// Main fetch function - fetches collection + assets via DAS
export async function fetchCollectionNFTs(
  collectionAddress: string,
  apiKey: string,
  network: 'devnet' | 'mainnet' = 'devnet',
  onProgress?: (loaded: number, total: number) => void
): Promise<NFTData[]> {
  const endpoint = buildRpcEndpoint(apiKey, network);

  // Fetch assets using DAS API (getAssetsByGroup)
  console.log('Fetching assets via DAS API (getAssetsByGroup)...');

  const coreAssets = await fetchAssetsByCollectionDAS(collectionAddress, endpoint, onProgress);

  console.log(`Found ${coreAssets.length} assets in collection`);

  // Convert to NFTData format
  const nfts: NFTData[] = coreAssets.map((asset: CoreAsset) => ({
    mint: asset.id,
    name: asset.name,
    image: asset.image,
    attributes: asset.attributes as NFTAttribute[],
    owner: asset.owner,
    uri: asset.uri,
  }));

  return nfts;
}

// Fetch with collection info
export async function fetchCollectionWithInfo(
  collectionAddress: string,
  apiKey: string,
  network: 'devnet' | 'mainnet' = 'devnet',
  onProgress?: (loaded: number, total: number) => void
): Promise<CollectionResult> {
  const endpoint = buildRpcEndpoint(apiKey, network);

  // Fetch collection metadata
  let collection: CollectionData | null = null;
  try {
    collection = await fetchCollectionData(collectionAddress, endpoint);
    console.log('Collection found:', collection.name);
  } catch (e) {
    console.warn('Could not fetch collection metadata:', e);
  }

  // Fetch assets
  const coreAssets = await fetchAssetsByCollectionDAS(collectionAddress, endpoint, onProgress);

  const assets: NFTData[] = coreAssets.map((asset: CoreAsset) => ({
    mint: asset.id,
    name: asset.name,
    image: asset.image,
    attributes: asset.attributes as NFTAttribute[],
    owner: asset.owner,
    uri: asset.uri,
  }));

  return { collection, assets };
}

export function buildTraitIndex(nfts: NFTData[]): TraitIndex {
  const index: TraitIndex = {};

  for (const nft of nfts) {
    for (const attr of nft.attributes) {
      if (!index[attr.trait_type]) {
        index[attr.trait_type] = {};
      }
      if (!index[attr.trait_type][attr.value]) {
        index[attr.trait_type][attr.value] = 0;
      }
      index[attr.trait_type][attr.value]++;
    }
  }

  return index;
}

export function calculateRarityScore(nft: NFTData, traitIndex: TraitIndex, totalNfts: number): number {
  if (nft.attributes.length === 0 || totalNfts === 0) return 0;

  let score = 0;
  for (const attr of nft.attributes) {
    const count = traitIndex[attr.trait_type]?.[attr.value] || 0;
    if (count > 0) {
      score += (1 - count / totalNfts) * 100;
    }
  }

  return score / nft.attributes.length;
}

// Re-export
export { buildRpcEndpoint } from './fetchCollectionData';
export type { CollectionData } from './fetchCollectionData';
export type { CoreAsset } from './fetchAssetsByCollection';
