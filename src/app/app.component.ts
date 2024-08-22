import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthorizationService } from './services/authorization-service';
import { UserActiveService } from './services/user-active.service';
import { AuthUser } from './models/auth_user';
import { NotificationService } from './services/notification.service';
import { WebSocketService } from './services/web-socket';
import { Subscription } from 'rxjs';
import { Reservation } from './models/reservation';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {

  // Selected User
  user: AuthUser | null = null;

  // Title of App
  title = 'OnlineLibrary';

  // Websocket Booking Notification
  private rentSubject: Subscription | undefined;
  private returnSubject: Subscription | undefined;

  constructor(
    private authorizationService: AuthorizationService,
    private userActiveService: UserActiveService,
    private notificationService: NotificationService,
    private webSocketService: WebSocketService,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.userActiveService.getSelectedUser().subscribe(selectedUser => {
      this.user = selectedUser;
    });

    // if no user is logged in and there is a token stored
    if (this.user === null && this.authorizationService.getAuthToken() != null) {

      this.authorizationService.validateToken().subscribe({
        next: (response) => {
          if (response && response.token) {

            this.userActiveService.setSelectedUser(response);

            // Redirect to Home
            this.router.navigate(['']);
          } else {
            console.error('Invalid response from validateToken');
            this.router.navigate(['/authentication']);
          }
        },
        error: (error) => {
          console.error('Error validating token:', error);
          this.router.navigate(['/authentication']);
        }
      });
    }

    this.rentSubject = this.webSocketService.getRentUpdates().subscribe(message => {
      const reservation: Reservation = JSON.parse(message);
      this.notificationService.sendMessage("User " + reservation.user.username + " has rented " + reservation.book.title);
    });
    this.returnSubject = this.webSocketService.getReturnUpdates().subscribe(message => {
      const reservation: Reservation = JSON.parse(message);
      this.notificationService.sendMessage("User " + reservation.user.username + " returned the " + reservation.book.title);
    });

  }

  ngOnDestroy() {
    if (this.rentSubject) {
      this.rentSubject.unsubscribe();
    }
    if (this.returnSubject) {
      this.returnSubject.unsubscribe();
    }
  }
}
