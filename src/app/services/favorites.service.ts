import { Injectable } from '@angular/core';
import { db } from '../firebase.config';
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
  getDoc
} from 'firebase/firestore';
import { FavoritePokemon } from '../models/favorite-pokemon.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private collectionName = 'favorites';

  constructor() {}

  addFavorite(fav: FavoritePokemon): Promise<void> {
    const colRef = collection(db, this.collectionName);
    return addDoc(colRef, fav).then(() => {});
  }

  getFavoritesByUser(userId: string): Observable<FavoritePokemon[]> {
    return new Observable<FavoritePokemon[]>((subscriber) => {
      const colRef = collection(db, this.collectionName);
      const q = query(colRef, where('userId', '==', userId));

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const data = snapshot.docs.map((d) => ({
            id: d.id,
            ...(d.data() as FavoritePokemon)
          }));
          subscriber.next(data);
        },
        (error) => subscriber.error(error)
      );

      return () => unsubscribe();
    });
  }

  async getFavoriteById(id: string): Promise<FavoritePokemon | null> {
    const docRef = doc(db, this.collectionName, id);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;

    return {
      id: snap.id,
      ...(snap.data() as FavoritePokemon)
    };
  }

  async updateFavorite(id: string, data: Partial<FavoritePokemon>): Promise<void> {
    const docRef = doc(db, this.collectionName, id);
    await updateDoc(docRef, data as any);
  }

  async deleteFavorite(id: string): Promise<void> {
    const docRef = doc(db, this.collectionName, id);
    await deleteDoc(docRef);
  }
}
