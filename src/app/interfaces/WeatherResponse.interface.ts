import { Location } from "./Location.interface";
import { CurrentWeather } from "./CurrentWeather.interface";
import { Forecast } from "./Forecast.interface";

export interface WeatherResponse {
  location: Location;
  current: CurrentWeather;
  forecast: Forecast;
}