import { Component, inject, OnInit, signal, effect, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FavoriteService, FavoriteLocation } from '../../services/favorite.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-favorites',
  imports: [CommonModule],
  templateUrl: './favorites.html',
  styleUrl: './favorites.scss'
})
export class Favorites implements OnInit {
  private favoriteService = inject(FavoriteService);
  private authService = inject(AuthService);

  favorites = this.favoriteService.favorites;
  isAuthenticated = this.authService.isAuthenticated;

  // Output event when a favorite is clicked
  favoriteSelected = output<string>();

  constructor() {
    // Watch for authentication changes and load favorites when user logs in
    effect(() => {
      if (this.isAuthenticated()) {
        this.loadFavorites();
      } else {
        // Clear favorites when user logs out
        this.favoriteService.clearFavorites();
      }
    });
  }

  ngOnInit(): void {
    if (this.isAuthenticated()) {
      this.loadFavorites();
    }
  }

  private async loadFavorites(): Promise<void> {
    try {
      await this.favoriteService.getFavorites();
    } catch (error) {
      console.error('Failed to load favorites:', error);
    }
  }

  onFavoriteClick(favorite: FavoriteLocation): void {
    // Emit the location as "lat,lon" format for the forecast service
    const locationString = `${favorite.latitude},${favorite.longitude}`;
    this.favoriteSelected.emit(locationString);
  }

  shouldShow(): boolean {
    return this.isAuthenticated() && this.favorites().length > 0;
  }
}
