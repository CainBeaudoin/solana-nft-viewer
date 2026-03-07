import { createUmi } from '@metaplex-foundation/umi-bundle-defaults';
import { fetchAsset, mplCore } from '@metaplex-foundation/mpl-core';
import { publicKey } from '@metaplex-foundation/umi';

export interface CoreAsset {
  id: string;
  name: string;
  image: string;
  owner: string;
  uri: string;
  updateAuthority: string;
  attributes: Array<{ trait_type: string; value: string }>;
}

// Fetch assets using DAS API (getAssetsByGroup)
export async function fetchAssetsByCollectionDAS(
  collectionAddress: string,
  rpcEndpoint: string,
  onProgress?: (loaded: number, total: number) => void
): Promise<CoreAsset[]> {
  const assets: CoreAsset[] = [];

  let page = 1;
  const limit = 100;
  let hasMore = true;

  while (hasMore) {
    const response = await fetch(rpcEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: '1',
        method: 'getAssetsByGroup',
        params: {
          groupKey: 'collection',
          groupValue: collectionAddress,
          page,
          limit,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`RPC request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (data.error) {
      if (data.error.message?.includes('Invalid API Key')) {
        throw new Error('Invalid API Key. Please check your Helius API key.');
      }
      throw new Error(data.error.message || 'DAS API error');
    }

    const items = data.result?.items || [];

    if (items.length === 0) {
      hasMore = false;
      break;
    }

    for (const item of items) {
      const attributes: Array<{ trait_type: string; value: string }> = [];

      // Extract attributes from metadata
      if (item.content?.metadata?.attributes) {
        for (const attr of item.content.metadata.attributes) {
          attributes.push({
            trait_type: attr.trait_type || 'Unknown',
            value: String(attr.value ?? ''),
          });
        }
      }

      assets.push({
        id: item.id,
        name: item.content?.metadata?.name || item.id.slice(0, 8),
        image: item.content?.links?.image || item.content?.files?.[0]?.uri || '',
        owner: item.ownership?.owner || '',
        uri: item.content?.json_uri || '',
        updateAuthority: item.authorities?.[0]?.address || '',
        attributes,
      });
    }

    onProgress?.(assets.length, assets.length + (items.length === limit ? limit : 0));

    if (items.length < limit) {
      hasMore = false;
    } else {
      page++;
    }
  }

  return assets;
}

// Fetch a single asset by address
export async function fetchSingleAsset(
  assetAddress: string,
  rpcEndpoint: string
): Promise<CoreAsset> {
  const umi = createUmi(rpcEndpoint).use(mplCore());

  const asset = await fetchAsset(umi, publicKey(assetAddress));

  // Fetch metadata from URI
  let image = '';
  let attributes: Array<{ trait_type: string; value: string }> = [];

  if (asset.uri) {
    try {
      let fetchUri = asset.uri;
      if (fetchUri.startsWith('ipfs://')) {
        fetchUri = fetchUri.replace('ipfs://', 'https://ipfs.io/ipfs/');
      }

      const response = await fetch(fetchUri);
      const json = await response.json();
      image = json.image || '';

      if (json.attributes) {
        attributes = json.attributes.map((attr: { trait_type?: string; value?: unknown }) => ({
          trait_type: attr.trait_type || 'Unknown',
          value: String(attr.value ?? ''),
        }));
      }
    } catch (e) {
      console.warn('Failed to fetch asset metadata:', e);
    }
  }

  // Also check on-chain attributes
  if (attributes.length === 0 && asset.attributes?.attributeList) {
    attributes = asset.attributes.attributeList.map(attr => ({
      trait_type: attr.key,
      value: attr.value,
    }));
  }

  return {
    id: asset.publicKey.toString(),
    name: asset.name,
    image,
    owner: asset.owner.toString(),
    uri: asset.uri,
    updateAuthority: asset.updateAuthority.address?.toString() || '',
    attributes,
  };
}
