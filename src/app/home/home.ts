import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
//import { WeatherCard } from '../components/weather-card/weather-card';
import { Forecast } from '../services/forecast';
import { WeatherResponse } from '../interfaces/WeatherResponse.interface';
import { Footer } from '../components/footer/footer';
import { WeatherDashboard } from '../components/weather-dashboard/weather-dashboard';

@Component({
  selector: 'app-home',
  imports: [CommonModule, WeatherDashboard, Footer],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements OnInit{
  weatherData = signal<WeatherResponse | null>(null);
  constructor(private forecastService: Forecast) {}
  ngOnInit() {
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
}
