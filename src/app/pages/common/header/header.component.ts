import { Component } from '@angular/core';
import { map, Observable } from 'rxjs';
import { UserActiveService } from '../../../services/user-active.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  isAuthenticated$!: Observable<boolean>;
  isAdmin$: Observable<boolean>;

  constructor(
    private authService : AuthService,
    private userActiveService: UserActiveService
  ) {
    this.isAdmin$ = this.userActiveService.isAdmin();
  }

  ngOnInit(): void {
    this.isAuthenticated$ = this.userActiveService.selectedUser$.pipe(
      map(user => !!user)
    );
  }

  onLogout(): void {
    this.userActiveService.setSelectedUser(null);
    this.authService.setAuthToken(null)
  }

}
