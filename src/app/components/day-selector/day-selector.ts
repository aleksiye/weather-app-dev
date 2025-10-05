import { Component, computed, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForecastDayComplete } from '../../interfaces/ForecastDayComplete.interface';

@Component({
  selector: 'app-day-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './day-selector.html',
  styleUrl: './day-selector.scss'
})
export class DaySelector {
  forecastDays = input<ForecastDayComplete[]>([]);
  selectedIndex = input<number>(0);
  daySelected = output<number>();

  // Format day display
  getDayName(index: number, date: string): string {
    if (index === 0) return 'Today';
    if (index === 1) return 'Tomorrow';
    
    const dayDate = new Date(date);
    return dayDate.toLocaleDateString('en-US', { weekday: 'short' });
  }

  selectDay(index: number) {
    this.daySelected.emit(index);
  }
}