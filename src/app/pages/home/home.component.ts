import { Component, OnInit, ViewChild } from '@angular/core';
import { UserActiveService } from '../../services/user-active.service';
import { AuthUser } from '../../models/auth_user';
import { UserService } from '../../services/user.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { BookDialogComponent } from '../../dialogs/book-dialog/book-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Book } from '../../models/views/book/book';
import { Reservation } from '../../models/reservation';
import { ReservationService } from '../../services/reservation.service';
import { UserRental } from '../../models/views/home/user-rental';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {

  // Selected User
  user: AuthUser | null = null;

  // Rented books
  userRentals: UserRental[] = [];

  // Rental History
  userRentalHistory: UserRental[] = []

  // Rented Configuration
  displayedRentalColumns: string[] = [
    'title',
    'category',
    'rentalAt',
    'days_passed',
    'days_signal',
    'return_action',
  ];

  // Return Configuration
  displayedReturnedColumns: string[] = [
    'title',
    'category',
    'rentalAt',
    'rentalStatusChangedAt',
    'days_passed',
    'days_signal'
  ];

  dataSource!: MatTableDataSource<UserRental, MatPaginator>;
  dataSourceHistory!: MatTableDataSource<UserRental, MatPaginator>;

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

      console.log("HOME");
      this.userService.getUserRentals(this.user.id).subscribe(

        (books) => {

          this.userRentals = [];
          this.userRentalHistory = [];

          for (const book of books) {

            console.log(book);
            
            // Rented
            if (book.rentalStatus === 'rented') {
              this.userRentals.push(book);

              // History
            } else if (book.rentalStatus === 'returned') {
              this.userRentalHistory.push(book);
            }
          }

          this.dataSource = new MatTableDataSource<UserRental>(this.userRentals);
          this.dataSourceHistory = new MatTableDataSource<UserRental>(this.userRentalHistory);

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
  getRentalDate(rentalAt: string): string {

    return rentalAt
      ? new Date(rentalAt).toLocaleDateString()
      : 'N/A';
  }

  // Calculate the number of days passed since the rental date
  getDaysPassed(rentalAt: string): number {

    if (rentalAt) {
      const rentalDate = new Date(rentalAt);
      const currentDate = new Date();
      const diffTime = Math.abs(currentDate.getTime() - rentalDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays;
    }
    return 0;
  }

  // Checks if user has rented books
  hasRentedBooks(): boolean {
    return this.userRentals.length > 0;
  }

  // Checks if user has rented books
  hasRentedBooksHistory(): boolean {
    return this.userRentalHistory.length > 0;
  }

  // Traffic light for duration of rental
  getColorClass(daysPassed: number): string {

    if (daysPassed < 15) {
      return 'green';
    } else if (daysPassed >= 15 && daysPassed < 30) {
      return 'yellow';
    } else if (daysPassed >= 30 && daysPassed < 35) {
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
