import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/book';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { AddBookDialogComponent } from '../../dialogs/add-book-dialog/add-book-dialog.component';
import { NotificationService } from '../../services/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrl: './books.component.css',
})
export class BooksComponent implements OnInit, AfterViewInit {

  // List of Books
  books: Book[] = [];

  // Table Configuration
  displayedColumns: string[] = ['title', 'category', 'copies', 'available', 'delete_action'];
  dataSource!: MatTableDataSource<Book, MatPaginator>;

  // Reference to the MatPaginator for pagination control
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private bookService: BookService,
    private notificationService : NotificationService,
    private router: Router,
    public dialog: MatDialog
  ) {}

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

  addBook() : void {
    const dialogRef = this.dialog.open(AddBookDialogComponent, {
      data : {} as Book
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result && result.el) {
        this.bookService.saveBook(result.el).subscribe(

          res => {
            this.notificationService.sendMessage("Book " + res.title + " for category " + res.category + " has been added successfully.");
          },
          error => {
            console.log('Error' + error);
          }
        )
      }
    });
  }

  deleteBook(book: Book): void {
    
    // Service Call
    this.bookService.deleteBook(book.id!).subscribe({

      // HTTP call is successful
      next: (response) => {

        // Deletion was successful
        if (response.status === 204) {
          this.notificationService.sendMessage("Successfully Deleted Book")
        }
      },

      // Error during HTTP call
      error: (error) => {
        this.notificationService.sendMessage(error.message)
      }
    });
  }

  viewDetails(book: Book): void {
    this.router.navigate(['/detail', 'book', book.id]);
  }
}
