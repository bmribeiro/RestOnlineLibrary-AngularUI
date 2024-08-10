import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthorizationService } from './services/authorization-service';
import { UserActiveService } from './services/user-active.service';
import { AuthUser } from './models/auth_user';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {

  // Selected User
  user: AuthUser | null = null;

  // Title of App
  title = 'OnlineLibrary';

  constructor(
    private authorizationService: AuthorizationService,
    private userActiveService: UserActiveService,
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
  }
}
