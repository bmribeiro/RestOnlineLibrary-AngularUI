import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import Highcharts from 'highcharts';

@Component({
  selector: 'app-category-books-chart',
  templateUrl: './category-books-chart.component.html',
  styleUrl: './category-books-chart.component.css'
})
export class CategoryBooksChartComponent implements OnChanges {

  // Chart Configuration
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {};

  // Rental history by category
  @Input() categoriesCount: { [key: string]: number } = {};

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['categoriesCount']) {
      this.updateChart();
    }
  }

  private updateChart(): void {

    const categories = Object.keys(this.categoriesCount);
    const counts = categories.map(category => this.categoriesCount[category]);

    this.chartOptions = {
      chart: {
        type: 'column'
      },
      title: {
        text: 'Rental history by category'
      },
      xAxis: {
        categories: categories,
        title: {
          text: 'Categories'
        }
      },
      yAxis: {
        title: {
          text: 'Number of Books'
        }
      },
      series: [
        {
          name: 'Books',
          data: counts
        }
      ] as Highcharts.SeriesOptionsType[]
    };
  }
}
