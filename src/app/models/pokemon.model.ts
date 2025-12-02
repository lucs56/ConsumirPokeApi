export interface PokemonType {
  type: {
    name: string;
  };
}

export interface PokemonApiResponse {
  id: number;
  name: string;
  sprites: {
    front_default: string;
  };
  types: PokemonType[];
}

// Para el listado paginado
export interface PokemonListItem {
  name: string;
  url: string;
  id: number;
  image: string;
}
