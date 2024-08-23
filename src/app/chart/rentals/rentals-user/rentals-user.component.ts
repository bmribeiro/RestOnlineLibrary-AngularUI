import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import Highcharts from 'highcharts';

@Component({
  selector: 'app-rentals-user',
  templateUrl: './rentals-user.component.html',
  styleUrl: './rentals-user.component.css'
})
export class RentalsUserComponent implements OnChanges {

  // Chart Configuration
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Highcharts.Options = {};

  // Number of books rented and returned
  @Input() rentedCount: number = 0;
  @Input() returnedCount: number = 0;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['rentedCount'] || changes['returnedCount']) {
      this.updateChart();
    }
  }

  private updateChart(): void {

    this.chartOptions = {
      chart: {
        type: 'line'
      },
      title: {
        text: 'History of Active Rentals and Returned Rentals'
      },
      xAxis: {
        categories: ['Rented', 'Returned']
      },
      yAxis: {
        title: {
          text: 'Rental Status'
        }
      },
      series: [
        {
          name: 'Books',
          data: [this.rentedCount, this.returnedCount]
        }
      ] as Highcharts.SeriesOptionsType[]
    };
  }
}

