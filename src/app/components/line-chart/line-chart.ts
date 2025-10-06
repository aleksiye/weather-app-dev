import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { ForecastDayComplete } from '../../interfaces/ForecastDayComplete.interface';
import { HourForecast } from '../../interfaces/HourForecast.interface';
import { ChartType, CHART_CONFIGS, ChartTypeConfig } from '../../models/chart.type';
Chart.register(...registerables);

@Component({
  standalone: true,
  selector: 'app-line-chart',
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './line-chart.html',
  styleUrl: './line-chart.scss'
})
export class LineChart {
  forecastDays = input<ForecastDayComplete[]>([]);
  selectedDayIndex = input<number>(0);
  chartType = input<ChartType>(ChartType.TEMPERATURE);
  locationTime = input<Date>(new Date());

  // Get current chart configuration based on selected type
  currentChartConfig = computed<ChartTypeConfig>(() => {
    const type = this.chartType();
    return CHART_CONFIGS.find(config => config.type === type) || CHART_CONFIGS[0];
  });

  // Create computed chart data based on forecast and chart type
  lineChartData = computed<ChartConfiguration<'line'>['data']>(() => {
    const days = this.forecastDays();
    const dayIndex = this.selectedDayIndex();
    const config = this.currentChartConfig();
    
    if (!days || days.length === 0) {
      return this.getFallbackData(config);
    }

    let hoursToDisplay: HourForecast[] = [];
    
    if (dayIndex === 0) {
      // TODAY: Show next 24 hours from current time
      const now = this.locationTime();
      const currentHour = now.getHours();
      
      const todayHours = days[0].hour;
      
      // Find current or next hour index
      const currentHourIndex = todayHours.findIndex(hour => {
        const hourTime = new Date(hour.time);
        return hourTime.getHours() >= currentHour;
      });
      
      // Get remaining hours from today
      const remainingToday = todayHours.slice(currentHourIndex);
      
      // Calculate hours needed from tomorrow
      const hoursNeeded = 24 - remainingToday.length;
      
      // Get hours from tomorrow if available
      let tomorrowHours: HourForecast[] = [];
      if (days.length > 1 && days[1]?.hour) {
        tomorrowHours = days[1].hour.slice(0, hoursNeeded);
      }
      
      // Combine hours
      hoursToDisplay = [...remainingToday, ...tomorrowHours];
      
    } else {
      // FUTURE DAY: Show all 24 hours of selected day
      if (days[dayIndex]?.hour) {
        hoursToDisplay = days[dayIndex].hour;
      }
    }

    // Extract labels from time property
    const hourlyLabels = hoursToDisplay.map(hour => {
      const timePart = hour.time.split(' ')[1];
      return timePart.substring(0, 5);
    });
    
    // Extract data based on chart type configuration
    const chartData = hoursToDisplay.map(hour => {
      const value = hour[config.dataKey];
      return typeof value === 'number' ? value : 0;
    });

    return {
      labels: hourlyLabels,
      datasets: [
        {
          data: chartData,
          label: config.label,
          borderColor: config.color,
          backgroundColor: this.getBackgroundColor(config.color),
          borderWidth: 3,
          pointBackgroundColor: config.color,
          pointBorderColor: '#2c2e31',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 8,
          pointHoverBackgroundColor: config.color,
          pointHoverBorderColor: '#2c2e31',
          pointHoverBorderWidth: 2,
          tension: 0.4,
          fill: true
        }
      ]
    };
  });

  // Dynamic chart options based on chart type
  lineChartOptions = computed<ChartConfiguration<'line'>['options']>(() => {
    const config = this.currentChartConfig();
    
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: '#2c2e31',
          titleColor: '#d1d0c5',
          bodyColor: '#d1d0c5',
          borderColor: '#3c3f41',
          borderWidth: 1,
          cornerRadius: 8,
          titleFont: {
            family: 'Roboto Mono',
            size: 12
          },
          bodyFont: {
            family: 'Roboto Mono',
            size: 12
          },
          padding: 12,
          displayColors: false,
          callbacks: {
            title: (context) => `${context[0].label}`,
            label: (context) => `${context.parsed.y}${config.unit}`
          }
        }
      },
      scales: {
        x: {
          grid: {
            color: '#3c3f41',
          },
          ticks: {
            color: '#646669',
            font: {
              family: 'Roboto Mono',
              size: 12
            },
            callback: function(value, index) {
              const labels = this.getLabelForValue(value as number);
              return index % 3 === 0 ? labels : '';
            }
          }
        },
        y: {
          position: 'right',
          grid: {
            color: '#3c3f41',
          },
          ticks: {
            color: '#646669',
            font: {
              family: 'Roboto Mono',
              size: 12
            },
            callback: (value) => {
              const numValue = value as number;
              if (config.type === ChartType.TEMPERATURE) {
                return `${numValue.toFixed(1)}${config.unit}`;
              }
              return `${Math.round(numValue)}${config.unit}`;
            }
          }
        }
      },
      interaction: {
        intersect: false,
        mode: 'index'
      },
      hover: {
        mode: 'index',
        intersect: false
      }
    };
  });

  private getFallbackData(config: ChartTypeConfig): ChartConfiguration<'line'>['data'] {
    return {
      labels: ['00:00', '06:00', '12:00', '18:00'],
      datasets: [
        {
          data: [15, 18, 22, 19],
          label: config.label,
          borderColor: config.color,
          backgroundColor: this.getBackgroundColor(config.color),
          borderWidth: 3,
          pointBackgroundColor: config.color,
          pointBorderColor: '#2c2e31',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 8,
          tension: 0.4,
          fill: true
        }
      ]
    };
  }

  private getBackgroundColor(color: string): string {
    // Convert hex to rgba with 0.1 opacity
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, 0.1)`;
  }
}
