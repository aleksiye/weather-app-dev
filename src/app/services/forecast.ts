import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { WeatherResponse } from '../interfaces/WeatherResponse.interface';
import { CurrentWeather } from '../interfaces/CurrentWeather.interface';
import { SearchResults } from '../interfaces/search.interface';

@Injectable({
  providedIn: 'root'
})
export class Forecast {
  http = inject(HttpClient);
  private readonly BASE_URL = 'http://localhost:3000/v1';
  getForecast(input: string, days: number = 7) {
    const url = `${this.BASE_URL}/forecast.json?q=${input}&days=${days}&aqi=yes`;
    return this.http.get<WeatherResponse>(url);
  }
  getCurrentWeather(input: string) {
    const url = `${this.BASE_URL}/current.json?q=${input}&aqi=yes`;
    return this.http.get<CurrentWeather>(url);
  }
  search(query: string) {
    const url = `${this.BASE_URL}/search.json?q=${query}`;
    return this.http.get<SearchResults>(url);
  }
}
