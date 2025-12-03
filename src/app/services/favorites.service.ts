import { Injectable } from '@angular/core';
import {
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  query,
  where,
  onSnapshot,
  getDoc,
} from 'firebase/firestore';
import { Observable } from 'rxjs';
import { db } from '../firebase.config';
import { FavoritePokemon } from '../models/favorite-pokemon.model';

@Injectable({
  providedIn: 'root',
})
export class FavoritesService {
  private collectionRef = collection(db, 'favorites');

  constructor() {}

  // 👉 Coincide con lo que hacías en home.component.ts:
  //    this.favoritesService.addFavorite(fav);
  addFavorite(fav: FavoritePokemon): Promise<any> {
    return addDoc(this.collectionRef, fav);
  }

  // Listar favoritos de un usuario (Observable para el componente)
  getFavoritesByUser(userId: string): Observable<FavoritePokemon[]> {
    const q = query(this.collectionRef, where('userId', '==', userId));

    return new Observable<FavoritePokemon[]>((subscriber) => {
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const data = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...(docSnap.data() as FavoritePokemon),
          }));
          subscriber.next(data);
        },
        (error) => subscriber.error(error)
      );

      return () => unsubscribe();
    });
  }

  // Obtener un favorito por ID (para la pantalla de editar)
  async getFavoriteById(id: string): Promise<FavoritePokemon | null> {
    const ref = doc(db, 'favorites', id);
    const snap = await getDoc(ref);

    if (!snap.exists()) return null;

    return {
      id: snap.id,
      ...(snap.data() as FavoritePokemon),
    };
  }

  // Actualizar un favorito
  updateFavorite(id: string, data: Partial<FavoritePokemon>): Promise<void> {
    const ref = doc(db, 'favorites', id);
    return updateDoc(ref, data as any);
  }

  // Eliminar un favorito
  deleteFavorite(id: string): Promise<void> {
    const ref = doc(db, 'favorites', id);
    return deleteDoc(ref);
  }
}
