import { Component, computed, input, OnChanges, OnInit, signal, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LineChart } from '../line-chart/line-chart';
import { WeatherResponse } from '../../interfaces/WeatherResponse.interface';
import { DaySelector } from '../day-selector/day-selector';

@Component({
  selector: 'app-weather-dashboard',
  imports: [CommonModule, LineChart, DaySelector],
  templateUrl: './weather-dashboard.html',
  styleUrl: './weather-dashboard.scss'
})
export class WeatherDashboard {
  weatherData = input<WeatherResponse | null>();
  selectedDayIndex = signal<number>(0);
  forecast = computed(() => {
    const data = this.weatherData();
    const index = this.selectedDayIndex();
    return data?.forecast?.forecastday?.[index] || data?.forecast?.forecastday?.[0];
  });
  
  allForecastDays = computed(() => {
    const data = this.weatherData();
    return data?.forecast?.forecastday || [];
  })
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
}
