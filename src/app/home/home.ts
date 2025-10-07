import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherDashboard } from '../components/weather-dashboard/weather-dashboard';
import { Header } from '../components/header/header';
import { Footer } from '../components/footer/footer';
import { Favorites } from '../components/favorites/favorites';
import { Forecast } from '../services/forecast';
import { WeatherResponse } from '../interfaces/WeatherResponse.interface';


@Component({
  selector: 'app-home',
  imports: [CommonModule, WeatherDashboard, Header, Footer, Favorites],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements OnInit{
  weatherData = signal<WeatherResponse | null>(null);
  isLoadingLocation = signal<boolean>(true);
  constructor(private forecastService: Forecast) {}
  ngOnInit() {
    this.getUserLocationAndLoadWeather();
  }
  getUserLocationAndLoadWeather(): void {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const location = `${lat},${lon}`;
          console.log('User location obtained:', location);
          this.loadWeatherData(location);
        },
        (error) => {
          console.warn('Geolocation error:', error.message);
          this.loadDefaultLocation();
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        }
      );
    } else {
      console.warn('Geolocation not supported by browser');
      this.loadDefaultLocation();
    }
  }

  loadDefaultLocation(): void {
    console.log('Loading default location: Belgrade');
    this.loadWeatherData('Belgrade');
  }

  loadWeatherData(location: string) {
    this.forecastService.getForecast(location).subscribe({
      next: (data: WeatherResponse) => {
        this.weatherData.set(data);
        console.log('Weather data received:', data);
      },
      error: (error: Error) => {
        console.error('Error fetching weather data:', error);
      }
  });
  }
  
  onSearchSubmitted(query: string): void {
    this.loadWeatherData(query);
  }

  onFavoriteSelected(location: string): void {
    this.loadWeatherData(location);
  }
}
