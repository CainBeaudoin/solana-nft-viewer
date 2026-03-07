export interface NFTAttribute {
  trait_type: string;
  value: string;
}

export interface NFTData {
  mint: string;
  name: string;
  image: string;
  attributes: NFTAttribute[];
}

export type TraitIndex = Record<string, Record<string, number>>;

export interface SelectedTrait {
  traitType: string;
  value: string;
}

export type SortOption = 'name-asc' | 'name-desc' | 'rarity-asc' | 'rarity-desc';
