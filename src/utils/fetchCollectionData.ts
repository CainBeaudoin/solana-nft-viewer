import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { fetchCollection, mplCore } from '@metaplex-foundation/mpl-core';
import { publicKey } from '@metaplex-foundation/umi';

export interface CollectionData {
  name: string;
  uri: string;
  updateAuthority: string;
  numMinted: number;
  currentSize: number;
}

// Build RPC endpoint from API key
export function buildRpcEndpoint(apiKey: string, network: 'devnet' | 'mainnet' = 'devnet'): string {
  if (!apiKey || apiKey.trim() === '') {
    throw new Error('API key is required');
  }

  const baseUrl = network === 'mainnet'
    ? 'https://mainnet.helius-rpc.com'
    : 'https://devnet.helius-rpc.com';

  return `${baseUrl}/?api-key=${apiKey.trim()}`;
}

export async function fetchCollectionData(
  collectionAddress: string,
  rpcEndpoint: string
): Promise<CollectionData> {
  const umi = createUmi(rpcEndpoint).use(mplCore());

  const collection = await fetchCollection(umi, publicKey(collectionAddress));

  return {
    name: collection.name,
    uri: collection.uri,
    updateAuthority: collection.updateAuthority.toString(),
    numMinted: collection.numMinted,
    currentSize: collection.currentSize,
  };
}
