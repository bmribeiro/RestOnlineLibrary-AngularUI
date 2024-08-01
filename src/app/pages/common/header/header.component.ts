import { Component } from '@angular/core';
import { map, Observable } from 'rxjs';
import { UserActiveService } from '../../../services/user-active.service';
import { AxiosService } from '../../../services/axios.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {

  isAuthenticated$!: Observable<boolean>;

  constructor(
    private axiosService: AxiosService,
    private userActiveService: UserActiveService) {}

  ngOnInit(): void {
    this.isAuthenticated$ = this.userActiveService.selectedUser$.pipe(
      map(user => !!user)
    );
  }

  onLogout(): void {
    this.userActiveService.setSelectedUser(null);
    this.axiosService.setAuthToken(null);
  }

}
