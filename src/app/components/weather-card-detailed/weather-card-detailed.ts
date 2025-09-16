import { Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LineChart } from '../line-chart/line-chart';
import { WeatherResponse } from '../../interfaces/WeatherResponse.interface';

@Component({
  selector: 'app-weather-card-detailed',
  imports: [CommonModule, LineChart],
  templateUrl: './weather-card-detailed.html',
  styleUrl: './weather-card-detailed.scss'
})
export class WeatherCardDetailed {

  weatherData = input<WeatherResponse | null>();
  forecast = computed(() => {
    const data = this.weatherData();
    console.log('Weather Data in WeatherCardDetailed:', data);
    return data?.forecast?.forecastday?.[0];
  });
  
  currentWeather = computed(() => this.weatherData()?.current);
  location = computed(() => this.weatherData()?.location);
}
