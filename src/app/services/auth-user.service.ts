import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AxiosService } from './axios.service';
import { AuthUser } from '../models/auth_user';

@Injectable({
  providedIn: 'root',
})
export class AuthUserService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private axiosService: AxiosService) {}

  getAuthUsers(): Observable<AuthUser[]> {
    return this.http.get<AuthUser[]>(`${this.apiUrl}/api/authUsers`, {
      headers: this.getHeaders(),
    });
  }

  private getHeaders(): HttpHeaders {
    let headers = new HttpHeaders();

    const authToken = this.axiosService.getAuthToken();
    if (authToken !== null) {
      headers = headers.set('Authorization', `Bearer ${authToken}`);
    }

    return headers;
  }
}
