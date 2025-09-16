import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import { ForecastDayComplete } from '../../interfaces/ForecastDayComplete.interface';
Chart.register(...registerables);

@Component({
  standalone: true,
  selector: 'app-line-chart',
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './line-chart.html',
  styleUrl: './line-chart.scss'
})
export class LineChart {
  forecastDay = input<ForecastDayComplete | undefined>();

  lineChartData = computed<ChartConfiguration<'line'>['data']>(() => {
    const day = this.forecastDay();
    console.log('Forecast Day in LineChart:', day);
    if (day?.hour) {
      const hourlyData = day.hour;
      console.log('Hourly Data:', hourlyData);
      const hourlyLabels = hourlyData.map(hour => {
        const time = hour.time.split(' ')[1];
        return time.substring(0, 5);
      });
      
      const hourlyTemps = hourlyData.map(hour => hour.temp_c);

      return {
        labels: hourlyLabels,
        datasets: [
          {
            data: hourlyTemps,
            label: 'Temperature',
            borderColor: '#e2b714',
            backgroundColor: 'rgba(226, 183, 20, 0.1)',
            borderWidth: 3,
            pointBackgroundColor: '#e2b714',
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

    // Fallback data
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
        },
        ticks: {
          color: '#646669',
          font: {
            family: 'Roboto Mono',
            size: 12
          },
          callback: function(value, index) {
            const labels = this.getLabelForValue(value as number);
            return index % 2 === 0 ? labels : '';
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
          callback: (value) => `${value}°C`
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
