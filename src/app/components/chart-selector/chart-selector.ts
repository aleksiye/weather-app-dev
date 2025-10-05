import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartType, CHART_CONFIGS, ChartTypeConfig } from '../../models/chart.type';

@Component({
  selector: 'app-chart-selector',
  imports: [CommonModule],
  templateUrl: './chart-selector.html',
  styleUrl: './chart-selector.scss'
})
export class ChartSelector {
  chartConfigs = CHART_CONFIGS;
  selectedType = input<ChartType>(ChartType.TEMPERATURE);
  chartTypeChanged = output<ChartType>();

  selectChart(type: ChartType) {
    this.chartTypeChanged.emit(type);
  }
}
