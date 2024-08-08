import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { BookService } from '../../services/book.service';
import { Book } from '../../models/book';
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
import { AvailableBook } from '../../models/available-book';

@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrl: './books.component.css',
})
export class BooksComponent implements OnInit, AfterViewInit {

  // Selected User
  user: AuthUser | null = null;

  // List of Books
  availableBooks: AvailableBook[] = [];

  // Table Configuration
  displayedColumns: string[] = [];
  dataSource!: MatTableDataSource<AvailableBook, MatPaginator>;

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

    this.bookService.getAllBooksWithUserRentalStatus(this.user!.id!).subscribe(
      (data) => {
        this.availableBooks = data;

        console.log(this.availableBooks);

        this.dataSource = new MatTableDataSource<AvailableBook>(this.availableBooks);
        console.log(this.availableBooks);

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
  actionOverBook(action: String, book: AvailableBook): void {

    console.log('> Action Over a Book');

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
          reservedAt: null,
          status: null,
          statusChangedAt: null
        };

        // Request Action
        if (result.action === 'reserve') {

          // Reservation
          console.log('> Reservation');

          this.reservationService.reserveBook(reservation).subscribe({

            // HTTP call is successful
            next: (response) => {
              console.log(response);
            }
          });

          // Return Action
        } else if (result.action === 'return') {

          // Reservation
          console.log('> Devolution');

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
    if (this.user?.profile === 'admin') {
      this.displayedColumns = ['title', 'category', 'copies', 'available', 'delete_action', 'request_action', 'return_action'];
    } else if (this.user?.profile === 'user') {
      this.displayedColumns = ['title', 'category', 'copies', 'available', 'request_action', 'return_action'];
    } else if (this.user?.profile === 'guest') {
      this.displayedColumns = ['title', 'category', 'copies', 'available'];
    } else {
      this.displayedColumns = [];
    }
  }

}

