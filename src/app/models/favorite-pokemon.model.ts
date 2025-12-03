// src/app/models/favorite-pokemon.model.ts

export interface FavoritePokemon {
  id?: string;        // ID del documento en Firestore
  userId: string;     // UID del usuario

  // Datos del Pokémon
  pokemonId: number;  // ID del Pokémon en la PokéAPI
  name: string;
  image: string;
  types: string[];

  // Campos opcionales
  note?: string | null;      // Nota libre
  alias?: string | null;     // Nombre alternativo que editás
  category?: string | null;  // "Categoría" que editás (tier, rol, etc.)
}
