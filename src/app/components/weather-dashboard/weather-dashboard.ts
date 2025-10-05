import { Component, computed, input, OnChanges, OnInit, signal, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LineChart } from '../line-chart/line-chart';
import { WeatherResponse } from '../../interfaces/WeatherResponse.interface';
import { DaySelector } from '../day-selector/day-selector';
import { ChartSelector } from '../chart-selector/chart-selector';
import { ChartType } from '../../models/chart.type';

@Component({
  selector: 'app-weather-dashboard',
  imports: [CommonModule, LineChart, DaySelector, ChartSelector],
  templateUrl: './weather-dashboard.html',
  styleUrl: './weather-dashboard.scss'
})
export class WeatherDashboard {
  weatherData = input<WeatherResponse | null>();
  selectedDayIndex = signal<number>(0);
  selectedChartType = signal<ChartType>(ChartType.TEMPERATURE);
  forecast = computed(() => {
    const data = this.weatherData();
    const index = this.selectedDayIndex();
    if (index === 0) return data?.forecast?.forecastday?.slice(0, 2);
    return data?.forecast?.forecastday?.[index];
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
  onChartSelected(type: ChartType) {
    this.selectedChartType.set(type);
    console.log(this.selectedChartType());
  }
}
