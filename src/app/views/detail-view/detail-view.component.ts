import { Component, Input, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { UserDetail } from '../../models/views/user/user-detail';
import { BookDetail } from '../../models/views/book/book-detail';
import { User } from '../../models/views/user/user';
import { Book } from '../../models/views/book/book';
import { Router } from '@angular/router';

@Component({
  selector: 'app-detail-view',
  templateUrl: './detail-view.component.html',
  styleUrl: './detail-view.component.css',
})
export class DetailViewComponent {

  @Input() data!: UserDetail | BookDetail;
  @Input() type!: 'user' | 'book';

  // Object
  objectData!: UserDetail | BookDetail;

  // Rented and Returned
  rentedCount: number = 0;
  returnedCount: number = 0;

  // Category and Quantity
  categoriesCount: { [key: string]: number } = {};

  private columnMappings: { [key: string]: string[] } = {
    'book': [
      'name',
      'rentalAt',
      'rentalStatus',
      'rentalStatusChangedAt',
    ],
    'user': [
      'title',
      'category',
      'rentalAt',
      'rentalStatus',
      'rentalStatusChangedAt',
    ]
  };

  displayedColumns: string[] = [];
  dataSource = new MatTableDataSource<any>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private router: Router
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['type']) {
      this.updateDisplayedColumns();
    }
    if (changes['data']) {
      this.updateDataSource();
    }
  }

  private updateDisplayedColumns(): void {

    console.log(this.type);

    if (this.columnMappings[this.type]) {
      this.displayedColumns = this.columnMappings[this.type];
    } else {
      this.displayedColumns = [];
    }
  }

  private updateDataSource(): void {

    if (this.type === 'book') {

      this.objectData = this.data as BookDetail;
      console.log(this.objectData);

      this.dataSource.data = (this.objectData as BookDetail).rentalUsers || [];

    } else if (this.type === 'user') {

      this.objectData = this.data as UserDetail;
      this.dataSource.data = (this.objectData as UserDetail).rentalBooks || [];

      // Counter Rented / Returned
      (this.objectData as UserDetail).rentalBooks.forEach(book => {
        if (book.rentalStatus === 'rented') {
          this.rentedCount++;
        } else if (book.rentalStatus === 'returned') {
          this.returnedCount++;
        }
      });

      // Category of Books and Quantity
      this.categoriesCount = {};

      (this.objectData as UserDetail).rentalBooks.forEach(book => {
        const category = book.category;
        if (this.categoriesCount[category]) {
          this.categoriesCount[category]++;
        } else {
          this.categoriesCount[category] = 1;
        }
      });
    }
    this.dataSource.paginator = this.paginator;
  }
  
  // User has history
  hasCategories(): boolean {
    return Object.keys(this.categoriesCount).length > 0;
  }

  /**
   * User Details Data
   */
  getUsername(): string | undefined {
    return (this.objectData as UserDetail)?.userView.username;
  }

  getUserProfile(): string | undefined {
    return (this.objectData as UserDetail)?.userView.role;
  }

  getUserCreated(): Date | undefined {
    return (this.objectData as UserDetail)?.userView.createdAt;
  }

  /**
   * Book Details Data
   */
  getBookTitle(): string | undefined {
    return (this.objectData as BookDetail)?.booksView.title;
  }

  getBookCategory(): string | undefined {
    return (this.objectData as BookDetail)?.booksView.category;
  }

  getBookCopies(): number | undefined {
    return (this.objectData as BookDetail)?.booksView.copies;
  }

  getBookAvailable(): boolean | undefined {
    return (this.objectData as BookDetail)?.booksView.available;
  }

  viewUserDetails(user: User): void {
    this.router.navigate(['/detail', 'user', user.id]);
  }

  viewBookDetails(book: Book): void {
    this.router.navigate(['/detail', 'book', book.id]);
  }



}
