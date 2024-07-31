import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { UsersService } from '../../services/users.service';
import { MatTableDataSource } from '@angular/material/table';
import { User } from '../../models/user';
import { MatPaginator } from '@angular/material/paginator';
import { AddUserDialogComponent } from '../../dialogs/add-user-dialog/add-user-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent implements OnInit, AfterViewInit {

  // List of Users
  users: User[] = [];

  // Table Configuration
  displayedColumns: string[] = ['user', 'email', 'role', 'created', 'active'];
  dataSource!: MatTableDataSource<User, MatPaginator>;

  // Reference to the MatPaginator for pagination control
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private usersService: UsersService,
    private notificationService : NotificationService,
    public dialog: MatDialog) {}

  ngOnInit(): void {
    console.log('> OnInit');

    this.usersService.getUsers().subscribe(
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

        this.usersService.saveUser(result.el).subscribe(

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
}