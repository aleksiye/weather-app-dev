import { HourForecast } from "../interfaces/HourForecast.interface";
export enum ChartType {
    TEMPERATURE = 'temperature',
    RAIN = 'rain',
    VISIBILITY = 'visibility',
    UV = 'uv'
}

export interface ChartTypeConfig {
    type: ChartType;
    label: string;
    icon: string;
    dataKey: keyof HourForecast;
    unit: string;
    color: string;
}

export const CHART_CONFIGS: ChartTypeConfig[] = [
  {
    type: ChartType.TEMPERATURE,
    label: 'Temp',
    icon: '🌡️',
    dataKey: 'temp_c',
    unit: '°C',
    color: '#e2b714'
  },
  {
    type: ChartType.RAIN,
    label: 'Rain',
    icon: '💧',
    dataKey: 'chance_of_rain',
    unit: '%',
    color: '#4a9eff'
  },
  {
    type: ChartType.VISIBILITY,
    label: 'Visibility',
    icon: '👁️',
    dataKey: 'vis_km',
    unit: 'km',
    color: '#9b59b6'
  },
  {
    type: ChartType.UV,
    label: 'UV',
    icon: '☀️',
    dataKey: 'uv',
    unit: '',
    color: '#f39c12'
  }
];