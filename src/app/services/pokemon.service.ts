import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { PokemonApiResponse, PokemonListItem } from '../models/pokemon.model';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {
  private apiUrl = 'https://pokeapi.co/api/v2/pokemon';

  constructor(private http: HttpClient) {}

  // Buscar por nombre o ID (como antes)
  getPokemon(nameOrId: string): Promise<PokemonApiResponse> {
    const url = `${this.apiUrl}/${nameOrId.toLowerCase()}`;
    return firstValueFrom(this.http.get<PokemonApiResponse>(url));
  }

  // Traer una página de pokémon (para el listado)
  async getPokemonPage(offset: number, limit: number): Promise<PokemonListItem[]> {
    const url = `${this.apiUrl}?offset=${offset}&limit=${limit}`;
    const res = await firstValueFrom(this.http.get<any>(url));

    // PokeAPI devuelve solo name y url, nosotros calculamos id e imagen
    const results: PokemonListItem[] = res.results.map((item: any, index: number) => {
      const id = offset + index + 1;
      const image = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`;

      return {
        name: item.name,
        url: item.url,
        id,
        image
      };
    });

    return results;
  }
}
