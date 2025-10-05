import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { ForecastDayComplete } from '../../interfaces/ForecastDayComplete.interface';
import { ChartType } from '../../models/chart.type';
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

  lineChartData = computed<ChartConfiguration<'line'>['data']>(() => {
    const days = this.forecastDays();
    const dayIndex = this.selectedDayIndex();
    let combinedHours: typeof days[0]['hour'] = [];
    if (dayIndex === 0 && days) {
      const now = new Date();
      const currentHour = now.getHours();
      const today = days[0];
      const tomorrow = days[1];
      const todayHours = today.hour;
      const currentHourIndex = todayHours.findIndex(hour => {
        const hourTime = new Date(hour.time);
        return hourTime.getHours() >= currentHour;
      });
      const remainingToday = todayHours.slice(currentHourIndex);
      const hoursNeeded = 24 - remainingToday.length;
      let tomorrowHours: typeof todayHours = [];
      tomorrowHours = tomorrow.hour.slice(0, hoursNeeded);
      combinedHours = [...remainingToday, ...tomorrowHours];
    }
    else if (dayIndex > 0 && days) {
      if(days[dayIndex]?.hour) {
        combinedHours = days[dayIndex].hour;
      }
    }
    const temps = combinedHours.map(hour => hour.temp_c);
    const timeLabels = combinedHours.map(hour => {
      const timePart = hour.time.split(' ')[1];
      return timePart.substring(0, 5);
    });
    if (combinedHours.length > 0) {
      return {
        labels: timeLabels,
        datasets: [
          {
            data: temps,
            label: 'Temperature',
            borderColor: '#e2b714',
            backgroundColor: 'rgba(226, 183, 20, 0.1)',
            borderWidth: 3,
            pointBackgroundColor: '#fad13dff',
            pointBorderColor: '#2c2e31',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 8,
            pointHoverBackgroundColor: '#f4c430',
            pointHoverBorderColor: '#2c2e31',
            pointHoverBorderWidth: 2,
            tension: 0.4,
            fill: true
          }
        ]
      };
    }
      
    

    // Fallback data if no forecast available
    return {
      labels: ['00:00', '06:00', '12:00', '18:00'],
      datasets: [
        {
          data: [15, 18, 22, 19],
          label: 'Temperature',
          borderColor: '#e2b714',
          backgroundColor: 'rgba(226, 183, 20, 0.1)',
          borderWidth: 3,
          pointBackgroundColor: '#e2b714',
          pointBorderColor: '#2c2e31',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 8,
          tension: 0.4,
          fill: true
        }
      ]
    };
  });

  public lineChartOptions: ChartConfiguration<'line'>['options'] = {
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
          label: (context) => `${context.parsed.y}°C`
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: '#3c3f41',
          //drawBorder: false
        },
        ticks: {
          color: '#646669',
          font: {
            family: 'Roboto Mono',
            size: 12
          },
          callback: function(value, index) {
            // Show every 3rd label to avoid overcrowding (00:00, 03:00, 06:00, etc.)
            const labels = this.getLabelForValue(value as number);
            return index % 2 === 0 ? labels : '';
          }
        }
      },
      y: {
        position: 'right',
        grid: {
          color: '#3c3f41',
          //drawBorder: false
        },
        ticks: {
          color: '#646669',
          font: {
            family: 'Roboto Mono',
            size: 12
          },
          callback: (value) => `${(value as number).toFixed(1)}°C`
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
}
