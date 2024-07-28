import { Component, OnInit } from '@angular/core';
import { BookService } from '../../services/book.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrl: './books.component.css',
})
export class BooksComponent implements OnInit {
  
  books$!: Observable<any[]>;

  constructor(private bookService: BookService) {}
  
  ngOnInit(): void {
    this.books$ = this.bookService.getBooks();
  }
}
