import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { BookService } from '../../services/book.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { AddBookDialogComponent } from '../../dialogs/add-book-dialog/add-book-dialog.component';
import { NotificationService } from '../../services/notification.service';
import { Router } from '@angular/router';
import { BookDialogComponent } from '../../dialogs/book-dialog/book-dialog.component';
import { UserActiveService } from '../../services/user-active.service';
import { AuthUser } from '../../models/auth_user';
import { Reservation } from '../../models/reservation';
import { ReservationService } from '../../services/reservation.service';
import { Book } from '../../models/views/book/book';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrl: './books.component.css',
})
export class BooksComponent implements OnInit, AfterViewInit {

  // Selected User
  user: AuthUser | null = null;

  // List of Books
  books: Book[] = [];

  // Table Configuration
  displayedColumns: string[] = [];
  dataSource!: MatTableDataSource<Book, MatPaginator>;

  // Reference to the MatPaginator for pagination control
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private bookService: BookService,
    private reservationService: ReservationService,
    private notificationService: NotificationService,
    private router: Router,
    private userActiveService: UserActiveService,
    public dialog: MatDialog
  ) {

    this.userActiveService.getSelectedUser().subscribe(selectedUser => {
      this.user = selectedUser;
      this.updateDisplayedColumns();
    });
  }

  ngOnInit(): void {
    console.log('> OnInit');

    this.bookService.getBooksWithUserRentalStatus(this.user!.id!).subscribe(
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

    // Connect MatPaginator to MatTableDataSource
    if (this.dataSource && this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  addBook(): void {
    const dialogRef = this.dialog.open(AddBookDialogComponent, {
      data: {} as Book
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

  deleteBook(availableBook: number): void {

    // Service Call
    this.bookService.deleteBook(availableBook).subscribe({

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

  // Actions on the book: Rent and Return
  actionOverBook(action: String, book: Book): void {

    const dialogRef = this.dialog.open(BookDialogComponent, {
      data: {
        obj: book,
        action: action
      }
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result && this.user != null) {

        const reservation: Reservation = {
          id: null,
          user: this.user,
          book: result.obj,
        };

        // Request Action
        if (result.action === 'reserve') {

          this.reservationService.reserveBook(reservation).subscribe({

            // HTTP call is successful
            next: (response) => {
              console.log(response);
            }
          });

          // Return Action
        } else if (result.action === 'return') {

          this.reservationService.returnBook(reservation).subscribe({

            // HTTP call is successful
            next: (response) => {
              console.log(response);
            }
          });
        }
      }

    });
  }

  viewDetails(book: Book): void {
    this.router.navigate(['/detail', 'book', book.id]);
  }

  // Displayed Columns
  private updateDisplayedColumns(): void {
    
    if (this.user?.role === 'admin') {
      this.displayedColumns = ['title', 'category', 'copies', 'available', 'delete_action', 'request_action', 'return_action'];
    } else if (this.user?.role === 'user') {
      this.displayedColumns = ['title', 'category', 'copies', 'available', 'request_action', 'return_action'];
    } else if (this.user?.role === 'guest') {
      this.displayedColumns = ['title', 'category', 'copies', 'available'];
    } else {
      this.displayedColumns = [];
    }
  }

}

