import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../services/user.service';
import { MatTableDataSource } from '@angular/material/table';
import { User } from '../../models/user';
import { MatPaginator } from '@angular/material/paginator';
import { AddUserDialogComponent } from '../../dialogs/add-user-dialog/add-user-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from '../../services/notification.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent implements OnInit, AfterViewInit {

  // List of Users
  users: User[] = [];

  // Table Configuration
  displayedColumns: string[] = ['user', 'email', 'role', 'created', 'active', 'delete_action'];
  dataSource!: MatTableDataSource<User, MatPaginator>;

  // Reference to the MatPaginator for pagination control
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private userService: UserService,
    private notificationService : NotificationService,
    private router: Router,
    public dialog: MatDialog) {}

  ngOnInit(): void {
    console.log('> OnInit');

    this.userService.getUsers().subscribe(
      (data) => {
        this.users = data;

        this.dataSource = new MatTableDataSource<User>(this.users);

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

  addUser() : void {
    const dialogRef = this.dialog.open(AddUserDialogComponent, {
      data : {} as User
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result && result.el) {

        this.userService.saveUser(result.el).subscribe(

          res => {
            this.notificationService.sendMessage("Utilizador " + res.username + " foi adicionado com sucesso.");
          },
          error => {
            console.log('Error' + error);
          }
        )
      }
    });
  }

  deleteUser(user: User): void {
    
    // Service Call
    this.userService.deleteUser(user.id!).subscribe({

      // HTTP call is successful
      next: (response) => {

        // Deletion was successful
        if (response.status === 204) {
          this.notificationService.sendMessage("Successfully Deleted User")
        }
      },

      // Error during HTTP call
      error: (error) => {
        this.notificationService.sendMessage(error.message)
      }
    });
  }

  viewDetails(user: User): void {
    this.router.navigate(['/detail', 'user', user.id]);
  }
}