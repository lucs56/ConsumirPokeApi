import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PokemonService } from '../../services/pokemon.service';
import { FavoritesService } from '../../services/favorites.service';
import { AuthService } from '../../services/auth.service';
import { PokemonApiResponse, PokemonListItem } from '../../models/pokemon.model';
import { FavoritePokemon } from '../../models/favorite-pokemon.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIf, NgFor],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  // Buscador
  searchTerm = '';
  pokemon: PokemonApiResponse | null = null;
  error = '';
  isSaving = false;

  // Listado paginado
  pokemonList: PokemonListItem[] = [];
  loadingList = false;
  page = 0;
  pageSize = 20; // cuántos por "Cargar más"

  constructor(
    private pokemonService: PokemonService,
    private favoritesService: FavoritesService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // al entrar a home, cargamos la primera página de pokémon
    this.loadMore();
  }

  // Buscar por nombre o id
  async search() {
    this.error = '';
    this.pokemon = null;

    if (!this.searchTerm.trim()) return;

    try {
      const data = await this.pokemonService.getPokemon(this.searchTerm.trim());
      this.pokemon = data;
    } catch (err) {
      console.error(err);
      this.error = 'No se encontró el Pokémon';
    }
  }

  // Agregar el Pokémon actual a favoritos
  async addToFavorites() {
    if (!this.pokemon) return;

    const userId = this.authService.getCurrentUserId();
    if (!userId) {
      this.error = 'Debes iniciar sesión para guardar favoritos';
      return;
    }

    this.isSaving = true;

    const fav: FavoritePokemon = {
      userId,
      pokemonId: this.pokemon.id,
      name: this.pokemon.name,
      image: this.pokemon.sprites.front_default,
      types: this.pokemon.types.map((t: any) => t.type.name),
      note: null
    };

    try {
      await this.favoritesService.addFavorite(fav);
    } catch (err) {
      console.error(err);
      this.error = 'Error al guardar favorito';
    } finally {
      this.isSaving = false;
    }
  }

  // Cargar más pokémon para la grilla inferior
  async loadMore() {
    if (this.loadingList) return;
    this.loadingList = true;

    const offset = this.page * this.pageSize;

    try {
      const pageData = await this.pokemonService.getPokemonPage(offset, this.pageSize);
      this.pokemonList = [...this.pokemonList, ...pageData];
      this.page++;
    } catch (err) {
      console.error('Error cargando lista de pokémon', err);
    } finally {
      this.loadingList = false;
    }
  }

  // Al hacer click en "Ver" desde la grilla
  async selectFromList(p: PokemonListItem) {
    this.searchTerm = p.name;
    await this.search();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
