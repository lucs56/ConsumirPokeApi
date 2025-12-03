import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, NgIf, NgFor } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { FavoritesService } from '../../services/favorites.service';
import { FavoritePokemon } from '../../models/favorite-pokemon.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, NgIf, NgFor],
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit, OnDestroy {
  favorites: FavoritePokemon[] = [];
  sub?: Subscription;
  loading = true;
  error = '';

  constructor(
    private favoritesService: FavoritesService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const uid = this.authService.getCurrentUserId();
    if (!uid) {
      this.error = 'Debes iniciar sesión';
      this.loading = false;
      return;
    }

    this.sub = this.favoritesService.getFavoritesByUser(uid).subscribe({
      next: (data) => {
        this.favorites = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Error al cargar favoritos';
        this.loading = false;
      }
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  editFavorite(fav: FavoritePokemon) {
    if (!fav.id) return;
    this.router.navigate(['/favorites', fav.id, 'edit']);
  }

  async deleteFavorite(fav: FavoritePokemon) {
    if (!fav.id) return;
    if (!confirm(`¿Eliminar a ${fav.name}?`)) return;

    try {
      await this.favoritesService.deleteFavorite(fav.id);
    } catch (err) {
      this.error = 'Error al eliminar';
    }
  }
}