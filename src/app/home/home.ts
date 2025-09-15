import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WeatherCard } from '../components/weather-card/weather-card';
import { WeatherCardDetailed } from '../components/weather-card-detailed/weather-card-detailed';

@Component({
  selector: 'app-home',
  imports: [CommonModule, WeatherCard, WeatherCardDetailed],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {

}
