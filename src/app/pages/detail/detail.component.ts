import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { AdminService } from '../../services/admin-service';
import { BookDetail } from '../../models/views/book/book-detail';
import { UserDetail } from '../../models/views/user/user-detail';
import { BehaviorSubject, Observable } from 'rxjs';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrl: './detail.component.css',
})
export class DetailComponent implements OnInit {

  private dataSubject = new BehaviorSubject<UserDetail | BookDetail | null>(null);
  data$: Observable<UserDetail | BookDetail | null> = this.dataSubject.asObservable();

  type!: 'user' | 'book';
  id!: number;

  constructor(
    private route: ActivatedRoute,
    private adminService: AdminService
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.id = +params['id'];
      this.type = params['type'] as 'user' | 'book';

      this.fetchData();
    });
  }

  private fetchData(): void {
    if (this.type === 'user') {
      this.adminService.getUserDetailById(this.id).subscribe({
        next: (response: HttpResponse<UserDetail>) => {
          this.dataSubject.next(response.body as UserDetail);
          console.log('User data received:', response.body);
        },
        error: (error) => {
          console.error('Error fetching user:', error);
        }
      });

    } else if (this.type === 'book') {
      this.adminService.getBookDetailById(this.id).subscribe({
        next: (response: HttpResponse<BookDetail>) => {
          this.dataSubject.next(response.body as BookDetail);
        },
        error: (error) => {
          console.error('Error fetching book:', error);
        }
      });
    }
  }
}
