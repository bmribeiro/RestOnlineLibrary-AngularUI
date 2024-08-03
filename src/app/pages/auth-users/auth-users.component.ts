import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { User } from '../../models/user';
import { NotificationService } from '../../services/notification.service';
import { UserService } from '../../services/user.service';
import { AuthUserService } from '../../services/auth-user.service';
import { AuthUser } from '../../models/auth_user';

@Component({
  selector: 'app-auth-users',
  templateUrl: './auth-users.component.html',
  styleUrl: './auth-users.component.css'
})
export class AuthUsersComponent {

  // List of Users
  authUsers: AuthUser[] = [];

  // Table Configuration
  displayedColumns: string[] = ['user', 'email', 'role', 'created', 'active'];
  dataSource!: MatTableDataSource<AuthUser, MatPaginator>;

  // Reference to the MatPaginator for pagination control
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private authUserService: AuthUserService,
    private notificationService: NotificationService,
    private router: Router,
    public dialog: MatDialog) { }

  ngOnInit(): void {
    console.log('> OnInit');

    this.authUserService.getAuthUsers().subscribe(
      (data) => {

        console.log(this.authUsers);

        this.authUsers = data;

        this.dataSource = new MatTableDataSource<AuthUser>(this.authUsers);

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
    console.log('> AfterViewInit');

    // Connect MatPaginator to MatTableDataSource
    if (this.dataSource && this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }


}
