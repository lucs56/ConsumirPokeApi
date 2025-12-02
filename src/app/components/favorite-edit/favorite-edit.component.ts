import { Component, OnInit } from '@angular/core';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FavoritesService } from '../../services/favorites.service';
import { FavoritePokemon } from '../../models/favorite-pokemon.model';

@Component({
  selector: 'app-favorite-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, NgIf, NgFor, RouterLink],
  templateUrl: './favorite-edit.component.html',
  styleUrls: ['./favorite-edit.component.css']
})
export class FavoriteEditComponent implements OnInit {
  favorite: FavoritePokemon | null = null;
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private favoritesService: FavoritesService
  ) {}

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error = 'ID no válido';
      this.loading = false;
      return;
    }

    try {
      const fav = await this.favoritesService.getFavoriteById(id);
      if (!fav) {
        this.error = 'Favorito no encontrado';
      } else {
        this.favorite = fav;
      }
    } catch (err) {
      this.error = 'Error al cargar el favorito';
    } finally {
      this.loading = false;
    }
  }

  async onSave() {
    if (!this.favorite || !this.favorite.id) return;

    try {
      await this.favoritesService.updateFavorite(this.favorite.id, {
        note: this.favorite.note ?? ''
      });
      this.router.navigate(['/favorites']);
    } catch (err) {
      this.error = 'Error al guardar cambios';
    }
  }
}
