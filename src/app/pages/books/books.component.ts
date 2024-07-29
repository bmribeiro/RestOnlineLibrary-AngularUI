import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/book';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrl: './books.component.css',
})
export class BooksComponent implements OnInit, AfterViewInit {
  // List of Books
  books: Book[] = [];

  // Table Configuration
  displayedColumns: string[] = ['title', 'category', 'copies', 'available'];
  dataSource!: MatTableDataSource<Book, MatPaginator>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    console.log('> OnInit');

    this.bookService.getBooks().subscribe(
      (data) => {
        this.books = data;

        this.dataSource = new MatTableDataSource<Book>(this.books);

        if (this.paginator) {
          // Connect MatPaginator to MatTableDataSource
          this.dataSource.paginator = this.paginator;
        }
      },
      (error) => {
        console.log('Error' + error);
      }
    );
  }

  ngAfterViewInit(): void {
    console.log('> AfterViewInit');

    // Connect MatPaginator to MatTableDataSource
    if (this.dataSource && this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }
}
