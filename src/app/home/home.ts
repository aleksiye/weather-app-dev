import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherCard } from '../components/weather-card/weather-card';
import { WeatherCardDetailed } from '../components/weather-card-detailed/weather-card-detailed';
import { Forecast } from '../services/forecast';
import { WeatherResponse } from '../interfaces/WeatherResponse.interface';
import { Footer } from '../components/footer/footer';

@Component({
  selector: 'app-home',
  imports: [CommonModule, WeatherCard, WeatherCardDetailed, Footer],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements OnInit{
  weatherData: WeatherResponse | null = null;
  constructor(private forecastService: Forecast) {
  }
  ngOnInit() {
    this.loadWeatherData('Belgrade');
  }

  loadWeatherData(location: string) {
    this.forecastService.getForecast(location).subscribe({
      next: (data: WeatherResponse) => {
        setTimeout(() => {
          this.weatherData = data;
          console.log('Weather data received:', data);
        }, 0);
      },
      error: (error: Error) => {
        console.error('Error fetching weather data:', error);
      }
  });
  }
}
