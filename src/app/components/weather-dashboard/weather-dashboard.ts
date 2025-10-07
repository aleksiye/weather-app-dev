import {
  Component,
  computed,
  inject,
  input,
  OnChanges,
  OnInit,
  signal,
  SimpleChanges,
  effect,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { LineChart } from '../line-chart/line-chart';
import { WeatherResponse } from '../../interfaces/WeatherResponse.interface';
import { DaySelector } from '../day-selector/day-selector';
import { ChartSelector } from '../chart-selector/chart-selector';
import { ChartType } from '../../models/chart.type';
import { AuthService } from '../../services/auth.service';
import { FavoriteService } from '../../services/favorite.service';

@Component({
  selector: 'app-weather-dashboard',
  imports: [CommonModule, LineChart, DaySelector, ChartSelector],
  templateUrl: './weather-dashboard.html',
  styleUrl: './weather-dashboard.scss',
})
export class WeatherDashboard {
  private authService = inject(AuthService);
  private favoriteService = inject(FavoriteService);

  weatherData = input<WeatherResponse | null>();
  selectedDayIndex = signal<number>(0);
  selectedChartType = signal<ChartType>(ChartType.TEMPERATURE);

  isAuthenticated = this.authService.isAuthenticated;

  // Computed to check if current location is in favorites
  isFavorite = computed(() => {
    const location = this.location();
    const favorites = this.favoriteService.favorites();
    
    if (!location) return false;
    
    // Check if this location exists in favorites (by coordinates)
    return favorites.some(fav => 
      Math.abs(fav.latitude - location.lat) < 0.001 && 
      Math.abs(fav.longitude - location.lon) < 0.001
    );
  });

  // Get the favorite ID if it exists
  private currentFavoriteId = computed(() => {
    const location = this.location();
    const favorites = this.favoriteService.favorites();
    
    if (!location) return null;
    
    const favorite = favorites.find(fav => 
      Math.abs(fav.latitude - location.lat) < 0.001 && 
      Math.abs(fav.longitude - location.lon) < 0.001
    );
    
    return favorite?.id ?? null;
  });

  forecast = computed(() => {
    const data = this.weatherData();
    const index = this.selectedDayIndex();
    if (index === 0) return data?.forecast?.forecastday?.slice(0, 2);
    return data?.forecast?.forecastday?.[index];
  });

  allForecastDays = computed(() => {
    const data = this.weatherData();
    return data?.forecast?.forecastday || [];
  });

  locationLocalTime = computed(() => {
    const location = this.location();
    return location?.localtime ? new Date(location.localtime) : new Date();
  });

  currentWeather = computed(() => this.weatherData()?.current);
  location = computed(() => this.weatherData()?.location);
  currentTime = computed(() => {
    const localtime = this.location()?.localtime;
    if (!localtime) return '';
    return localtime.split(' ')[1];
  });

  onDaySelected(index: number) {
    this.selectedDayIndex.set(index);
    console.log(this.selectedDayIndex());
  }
  
  onChartSelected(type: ChartType) {
    this.selectedChartType.set(type);
    console.log(this.selectedChartType());
  }
  
  async toggleFavorite() {
    if (!this.isAuthenticated()) {
      console.warn('User must be logged in to favorite locations');
      return;
    }

    const location = this.location();
    if (!location) {
      console.warn('No location data available');
      return;
    }

    try {
      if (this.isFavorite()) {
        // Remove from favorites
        const favoriteId = this.currentFavoriteId();
        if (favoriteId) {
          await this.favoriteService.deleteFavorite(favoriteId);
          console.log('Removed from favorites:', location.name);
        }
      } else {
        // Add to favorites
        await this.favoriteService.createFavorite({
          name: location.name,
          latitude: location.lat,
          longitude: location.lon
        });
        console.log('Added to favorites:', location.name);
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
      // You could add a toast notification here
    }
  }
}
