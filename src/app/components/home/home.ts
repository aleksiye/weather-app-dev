import { Component } from '@angular/core';
import { WeatherCard } from '../weather-card/weather-card';
import { WeatherCardDetailed } from '../weather-card-detailed/weather-card-detailed';

@Component({
  selector: 'app-home',
  imports: [WeatherCard, WeatherCardDetailed],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {

}
