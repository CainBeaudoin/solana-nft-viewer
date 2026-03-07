import { Connection, PublicKey } from '@solana/web3.js';
import { Metaplex, Metadata, Nft, Sft } from '@metaplex-foundation/js';
import { NFTData, NFTAttribute, TraitIndex } from '../types/nft';

const DEFAULT_RPC = 'https://api.mainnet-beta.solana.com';

export function createConnection(rpcUrl?: string): Connection {
  return new Connection(rpcUrl || DEFAULT_RPC, 'confirmed');
}

export function createMetaplex(rpcUrl?: string): Metaplex {
  const connection = createConnection(rpcUrl);
  return Metaplex.make(connection);
}

export function isValidSolanaAddress(address: string): boolean {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
}

type MetadataResult = Metadata | Nft | Sft;

export async function fetchCollectionNFTs(
  metaplex: Metaplex,
  collectionAddress: string,
  onProgress?: (loaded: number, total: number) => void
): Promise<NFTData[]> {
  const collectionMint = new PublicKey(collectionAddress);

  // First, try to get the collection NFT to verify it exists
  let collectionNft;
  try {
    collectionNft = await metaplex.nfts().findByMint({ mintAddress: collectionMint });
  } catch (error) {
    console.warn('Could not find collection NFT, will try to find NFTs by creator');
  }

  // Try to find NFTs by the collection's update authority (creator)
  // This is a common pattern where the collection creator is the first verified creator
  let nftList: MetadataResult[] = [];

  if (collectionNft) {
    // Get the first verified creator from the collection
    const creators = collectionNft.creators;
    const verifiedCreator = creators.find(c => c.verified);

    if (verifiedCreator) {
      const allByCreator = await metaplex.nfts().findAllByCreator({
        creator: verifiedCreator.address,
        position: 1
      });

      // Filter to only include NFTs that belong to this collection
      nftList = allByCreator.filter(nft => {
        if (nft.model === 'metadata') {
          const metadata = nft as Metadata;
          return metadata.collection?.address.equals(collectionMint) &&
                 metadata.collection?.verified;
        }
        return false;
      });
    }
  }

  // If no NFTs found via creator, try using the collection address as update authority
  if (nftList.length === 0) {
    try {
      nftList = await metaplex.nfts().findAllByUpdateAuthority({
        updateAuthority: collectionMint
      });
    } catch (error) {
      console.warn('Could not find NFTs by update authority');
    }
  }

  // If still no results, try finding by owner (in case user entered an owner address)
  if (nftList.length === 0) {
    try {
      const byOwner = await metaplex.nfts().findAllByOwner({
        owner: collectionMint
      });
      nftList = byOwner;
    } catch (error) {
      console.warn('Could not find NFTs by owner');
    }
  }

  const total = nftList.length;
  const nfts: NFTData[] = [];

  // Load full metadata in batches to avoid rate limiting
  const batchSize = 10;
  for (let i = 0; i < nftList.length; i += batchSize) {
    const batch = nftList.slice(i, i + batchSize);

    const loadedBatch = await Promise.all(
      batch.map(async (nft: MetadataResult) => {
        try {
          if (nft.model === 'metadata') {
            const loaded = await metaplex.nfts().load({ metadata: nft as Metadata });
            return loaded;
          }
          return nft;
        } catch (error) {
          console.warn(`Failed to load NFT: ${nft.name}`, error);
          return null;
        }
      })
    );

    for (const loaded of loadedBatch) {
      if (loaded && 'json' in loaded && loaded.json) {
        const attributes: NFTAttribute[] = (loaded.json.attributes || []).map(
          (attr: { trait_type?: string; value?: string | number }) => ({
            trait_type: attr.trait_type || 'Unknown',
            value: String(attr.value ?? ''),
          })
        );

        nfts.push({
          mint: loaded.address.toString(),
          name: loaded.name,
          image: loaded.json.image || '',
          attributes,
        });
      }
    }

    onProgress?.(Math.min(i + batchSize, total), total);
  }

  return nfts;
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
      // Lower count = higher rarity = higher score
      score += (1 - count / totalNfts) * 100;
    }
  }

  return score / nft.attributes.length;
}
