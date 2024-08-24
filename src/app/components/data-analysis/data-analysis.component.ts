import { Component } from '@angular/core';
import { BookService } from '../../services/book.service';
import { PopularBook } from '../../models/dataAnalysis/popularBook';

@Component({
  selector: 'app-data-analysis',
  templateUrl: './data-analysis.component.html',
  styleUrl: './data-analysis.component.css'
})
export class DataAnalysisComponent {

  // Most popular book
  mostPopularBook: PopularBook | null = null;

  // Most popular books for each Category
  popularBooksByCategory: PopularBook[] = [];

  constructor(private bookService: BookService) { }

  ngOnInit(): void {

    // Most popular book
    this.bookService.getMostPopularBook().subscribe((data) => {
      this.mostPopularBook = data;
    });


    // Most popular book for each Category
    this.bookService.getMostPopularBooksByCategory().subscribe(
      (data: PopularBook[]) => {
        this.popularBooksByCategory = data;
      },
      (error) => {
        console.error('Error fetching popular books', error);
      }
    );
  }
}
