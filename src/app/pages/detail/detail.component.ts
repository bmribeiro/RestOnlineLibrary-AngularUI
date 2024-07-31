import { Component, OnInit } from '@angular/core';
import { Book } from '../../models/book';
import { User } from '../../models/user';
import { ActivatedRoute } from '@angular/router';
import { BookService } from '../../services/book.service';
import { UserService } from '../../services/user.service';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.css',
})
export class DetailComponent implements OnInit {

  data!: User | Book;
  type!: 'user' | 'book';
  id!: number;

  constructor(
    private route: ActivatedRoute,
    private userService: UserService,
    private bookService: BookService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {

      this.id = +params['id'];
      this.type = params['type'] as 'user' | 'book';

      if (this.type === 'user') {
        
        this.userService.getUserById(this.id).subscribe({

          next: (response: HttpResponse<User>) => {
            this.data = response.body as User;
          },
          error: (error) => {
            console.error('Error fetching user:', error);
          }
        });

      } else if (this.type === 'book') {

        this.bookService.getBookById(this.id).subscribe({

          next: (response: HttpResponse<Book>) => {
            this.data = response.body as Book;
          },
          error: (error) => {
            console.error('Error fetching user:', error);
          }
        });
      }
    });
  }

}
