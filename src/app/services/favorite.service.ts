import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface FavoriteLocation {
  id: number;
  userId: string;
  name: string;
  latitude: number;
  longitude: number;
  createdAt: string;
}

export interface CreateFavoriteLocationDto {
  name: string;
  latitude: number;
  longitude: number;
}

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  private http = inject(HttpClient);
  private readonly API_URL = '/api/favorite-locations';

  private favoritesSignal = signal<FavoriteLocation[]>([]);
  
  // Public readonly access to favorites
  favorites = this.favoritesSignal.asReadonly();

  /**
   * Get all favorite locations for the authenticated user
   */
  async getFavorites(): Promise<FavoriteLocation[]> {
    try {
      const locations = await this.http
        .get<FavoriteLocation[]>(this.API_URL)
        .toPromise();
      
      if (locations) {
        this.favoritesSignal.set(locations);
        return locations;
      }
      return [];
    } catch (error) {
      console.error('Failed to fetch favorite locations:', error);
      throw error;
    }
  }

  /**
   * Create a new favorite location
   */
  async createFavorite(data: CreateFavoriteLocationDto): Promise<FavoriteLocation> {
    try {
      const newLocation = await this.http
        .post<FavoriteLocation>(this.API_URL, data)
        .toPromise();
      
      if (newLocation) {
        // Add the new location to the beginning of the array (since backend orders by createdAt desc)
        this.favoritesSignal.update(favorites => [newLocation, ...favorites]);
        return newLocation;
      }
      throw new Error('Failed to create favorite location');
    } catch (error) {
      console.error('Failed to create favorite location:', error);
      throw error;
    }
  }

  /**
   * Delete a favorite location by ID
   */
  async deleteFavorite(id: number): Promise<void> {
    try {
      await this.http
        .delete<{ message: string }>(`${this.API_URL}/${id}`)
        .toPromise();
      
      // Remove the deleted location from the signal
      this.favoritesSignal.update(favorites => 
        favorites.filter(fav => fav.id !== id)
      );
    } catch (error) {
      console.error('Failed to delete favorite location:', error);
      throw error;
    }
  }

  /**
   * Clear all favorites from the signal (useful on logout)
   */
  clearFavorites(): void {
    this.favoritesSignal.set([]);
  }
}
