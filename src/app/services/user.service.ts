import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../models/user';
import { AxiosService } from './axios.service';
import { Book } from '../models/book';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  private apiUrl = environment.apiUrl;
  
  constructor(private http: HttpClient, private axiosService: AxiosService) {}

  getUsers(): Observable<User[]> {

    return this.http.get<User[]>(`${this.apiUrl}/api/users`, { headers: this.getHeaders() });
  }

  getUserById(id : number) : Observable<HttpResponse<User>>{
    
    return this.http.get<User>(`${this.apiUrl}/api/users/${id}`, { headers: this.getHeaders(), observe: 'response'});
  }

  saveUser(user: User): Observable<User>{
    return this.http.post<User>(`${this.apiUrl}/api/users`,user);
  }

  deleteUser(id: number): Observable<HttpResponse<void>> {
    
    // Call to HttpClient
    return this.http.delete<void>(`${this.apiUrl}/api/users/${id}`, { observe: 'response'})
    
    // Chain additional operations to the Observable
    .pipe(

      // Execution errors
      catchError(error => {

        // User not found
        if (error.status === 404) {
          return throwError(() => new Error('User not found.'));
        }

        // Other errors
        return throwError(() => new Error('An unexpected error has occurred.'));
      })
    );
  }

  getBooksReservedByUser(userId: number): Observable<Book[]> {

    console.log("Serviço");
    return this.http.get<Book[]>(`${this.apiUrl}/api/authUsers/${userId}/books`, { headers: this.getHeaders()});
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
