import { Component, inject, OnInit, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
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
  private router = inject(Router);

  favorites = this.favoriteService.favorites;
  isAuthenticated = this.authService.isAuthenticated;

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
    // Navigate to the weather for this location
    // You can customize this based on your routing structure
    this.router.navigate(['/'], {
      queryParams: {
        lat: favorite.latitude,
        lon: favorite.longitude,
        name: favorite.name
      }
    });
  }

  shouldShow(): boolean {
    return this.isAuthenticated() && this.favorites().length > 0;
  }
}
