import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { FavoritesService } from '../../services/favorites.service';
import { FavoritePokemon } from '../../models/favorite-pokemon.model';

@Component({
  selector: 'app-favorite-edit',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './favorite-edit.component.html',
  styleUrls: ['./favorite-edit.component.css']
})
export class FavoriteEditComponent implements OnInit {
  favorite?: FavoritePokemon;
  loading = true;
  error = '';

  alias = '';
  category = '';
  note = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private favoritesService: FavoritesService
  ) {}

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error = 'ID inválida';
      this.loading = false;
      return;
    }

    try {
      const fav = await this.favoritesService.getFavoriteById(id);
      if (!fav) {
        this.error = 'No se encontró el favorito';
        this.loading = false;
        return;
      }

      this.favorite = fav;
      this.alias = fav.alias || '';
      this.category = fav.category || '';
      this.note = fav.note || '';
      this.loading = false;
    } catch (e) {
      console.error(e);
      this.error = 'Error al cargar el favorito';
      this.loading = false;
    }
  }

  async save() {
    if (!this.favorite?.id) return;

    try {
      await this.favoritesService.updateFavorite(this.favorite.id, {
        alias: this.alias || null,
        category: this.category || null,
        note: this.note || null
      });

      this.router.navigate(['/favorites']);
    } catch (e) {
      console.error(e);
      this.error = 'Error al guardar los cambios';
    }
  }

  cancel() {
    this.router.navigate(['/favorites']);
  }
}
