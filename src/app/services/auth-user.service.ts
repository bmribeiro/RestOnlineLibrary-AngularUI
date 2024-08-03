import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthUser } from '../models/auth_user';

@Injectable({
  providedIn: 'root',
})
export class AuthUserService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAuthUsers(): Observable<AuthUser[]> {
    return this.http.get<AuthUser[]>(`${this.apiUrl}/api/authUsers`);
  }

 
}
