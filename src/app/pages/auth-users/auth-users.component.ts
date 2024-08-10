import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { User } from '../../models/views/user/user';
import { NotificationService } from '../../services/notification.service';
import { AdminService } from '../../services/admin-service';

@Component({
  selector: 'app-auth-users',
  templateUrl: './auth-users.component.html',
  styleUrl: './auth-users.component.css'
})
export class AuthUsersComponent {

  // List of Users
  authUsers: User[] = [];

  // Table Configuration
  displayedColumns: string[] = ['user', 'email', 'role', 'created', 'active'];
  dataSource!: MatTableDataSource<User, MatPaginator>;

  // Reference to the MatPaginator for pagination control
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private adminService: AdminService,
    private notificationService: NotificationService,
    private router: Router,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    console.log('> OnInit');

    this.adminService.getAuthUsers().subscribe(
      (data) => {

        this.authUsers = data;
        this.dataSource = new MatTableDataSource<User>(this.authUsers);

        if (this.paginator) {

          // Connect MatPaginator to MatTableDataSource
          this.dataSource.paginator = this.paginator;
        }
      },
      (error) => {
        console.log('Error: ' + error);
      }
    );
  }

  ngAfterViewInit(): void {

    // Connect MatPaginator to MatTableDataSource
    if (this.dataSource && this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  viewDetails(user: User): void {
    this.router.navigate(['/detail', 'user', user.id]);
  }

}
