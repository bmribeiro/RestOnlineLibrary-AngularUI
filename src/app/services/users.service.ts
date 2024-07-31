import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root',
})
export class UsersService {

  private apiUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/api/users`);
  }

  saveUser(user: User): Observable<User>{
    return this.http.post<User>(`${this.apiUrl}/api/users`,user);
  }
}
