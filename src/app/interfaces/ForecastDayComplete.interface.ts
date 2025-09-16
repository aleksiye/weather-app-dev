import { ForecastDay } from './ForecastDay.interface';
import { Astro } from './Astro.interface';
import { HourForecast } from './HourForecast.interface';

export interface ForecastDayComplete {
  date: string;
  date_epoch: number;
  day: ForecastDay;
  astro: Astro;
  hour: HourForecast[];
}