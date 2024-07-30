import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/book';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { AddBookDialogComponent } from '../../dialogs/add-book-dialog/add-book-dialog.component';
import { NotificationService } from '../../services/notification.service';

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

  // Reference to the MatPaginator for pagination control
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private bookService: BookService,
    private notificationService : NotificationService,
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
}
