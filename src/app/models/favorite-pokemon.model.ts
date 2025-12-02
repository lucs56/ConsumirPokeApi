export interface FavoritePokemon {
  id?: string;
  pokemonId: number;
  name: string;
  image: string;
  types: string[];
  note?: string;
  userId: string;
}
