import { Component, OnInit, ViewChild } from '@angular/core';
import { UserActiveService } from '../../services/user-active.service';
import { Book } from '../../models/book';
import { AuthUser } from '../../models/auth_user';
import { UserService } from '../../services/user.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { BookDialogComponent } from '../../dialogs/book-dialog/book-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { UserBookRental } from '../../models/user-book-rental.ts';
import { AvailableBook } from '../../models/available-book';
import { Reservation } from '../../models/reservation';
import { ReservationService } from '../../services/reservation.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {

  // Selected User
  user: AuthUser | null = null;

  // Rented books
  userBookRentals: UserBookRental[] = [];

  // Rental History
  userBookRentalHistory: UserBookRental[] = []

  // Rented Configuration
  displayedRentalColumns: string[] = [
    'title',
    'category',
    'rental_date',
    'days_passed',
    'days_signal',
    'return_action',
  ];

  // Return Configuration
  displayedReturnedColumns: string[] = [
    'title',
    'category',
    'rental_date',
    'statusChangedAt',
    'days_passed',
    'days_signal'
  ];

  dataSource!: MatTableDataSource<UserBookRental, MatPaginator>;

  dataSourceHistory!: MatTableDataSource<UserBookRental, MatPaginator>;

  // Reference to the MatPaginator for pagination control
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private userService: UserService,
    private userActiveService: UserActiveService,
    private reservationService: ReservationService,
    public dialog: MatDialog,
    private router: Router
  ) {
    this.userActiveService.getSelectedUser().subscribe((selectedUser) => {
      this.user = selectedUser;
    });
  }

  ngOnInit(): void {
    if (this.user && typeof this.user.id === 'number') {
      this.userService.getUserBookRentals(this.user.id).subscribe(

        (books) => {

          this.userBookRentals = [];
          this.userBookRentalHistory = [];

          for (const book of books) {
            
            // Rented
            if (book.status === 'rented') {

              console.log("Rented");
              this.userBookRentals.push(book);

              // History
            } else if (book.status === 'returned') {

              console.log("Returned");
              this.userBookRentalHistory.push(book);
            }
          }

          this.dataSource = new MatTableDataSource<UserBookRental>(this.userBookRentals);
          this.dataSourceHistory = new MatTableDataSource<UserBookRental>(this.userBookRentalHistory);

          if (this.paginator) {
            
            // Connect MatPaginator to MatTableDataSource
            this.dataSource.paginator = this.paginator;
            this.dataSourceHistory.paginator = this.paginator;
          }
        },
        (error) => {
          console.error('Error loading books', error);
        }
      );
    } else {
      console.warn('User ID not found or invalid');
    }
  }

  ngAfterViewInit(): void {
    console.log('> AfterViewInit');

    // Connect MatPaginator to MatTableDataSource
    if (this.dataSource && this.paginator) {

      this.dataSource.paginator = this.paginator;
      this.dataSourceHistory.paginator = this.paginator;
    }
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

        if (result.action === 'return') {

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

  // Rental Date
  getRentalDate(reservedAt: string): string {

    return reservedAt
      ? new Date(reservedAt).toLocaleDateString()
      : 'N/A';
  }

  // Calculate the number of days passed since the rental date
  getDaysPassed(reservedAt: string): number {

    if (reservedAt) {
      const rentalDate = new Date(reservedAt);
      const currentDate = new Date();
      const diffTime = Math.abs(currentDate.getTime() - rentalDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    }
    return 0;
  }

  // Checks if user has rented books
  hasRentedBooks(): boolean {
    return this.userBookRentals.length > 0;
  }

  // Checks if user has rented books
  hasRentedBooksHistory(): boolean {
    return this.userBookRentalHistory.length > 0;
  }

  // Traffic light for duration of rental
  getColorClass(daysPassed: number): string {

    if (daysPassed < 5) {
      return 'green';
    } else if (daysPassed >= 5 && daysPassed < 10) {
      return 'yellow';
    } else if (daysPassed >= 10 && daysPassed < 15) {
      return 'orange';
    } else {
      return 'red';
    }
  }

  // Book details
  viewDetails(book: Book): void {
    this.router.navigate(['/detail', 'book', book.id]);
  }
}
