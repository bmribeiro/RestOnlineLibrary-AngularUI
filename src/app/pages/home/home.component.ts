import { Component, OnInit } from '@angular/core';
import { UserActiveService } from '../../services/user-active.service';
import { Book } from '../../models/book';
import { AuthUser } from '../../models/auth_user';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit {
  
  user: AuthUser | null = null;
  books: Book[] = [];

  constructor(
    private userService: UserService,
    private userActiveService: UserActiveService
  ) {
    this.userActiveService.getSelectedUser().subscribe((selectedUser) => {
      this.user = selectedUser;
    });
  }

  ngOnInit(): void {
    if (this.user && typeof this.user.id === 'number') {
      this.userService.getBooksReservedByUser(this.user.id).subscribe(
        (books) => {
          console.log(books);
          this.books = books;
        },
        (error) => {
          console.error('Error loading books', error);
        }
      );
    } else {
      console.warn('User ID not found or invalid');
    }
  }
}
