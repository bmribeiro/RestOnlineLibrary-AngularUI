import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../models/views/user/user';
import { UserRental } from '../models/views/home/user-rental';


@Injectable({
  providedIn: 'root',
})
export class UserService {
 

  private apiUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {

    return this.http.get<User[]>(`${this.apiUrl}/api/users`);
  }

  getUserById(id : number) : Observable<HttpResponse<User>>{
    
    return this.http.get<User>(`${this.apiUrl}/api/users/${id}`, { observe: 'response'});
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
  
  getUserRentals(userId: number): Observable<UserRental[]> {

    return this.http.get<UserRental[]>(`${this.apiUrl}/api/users/${userId}/rentals`);
  }

  
  
}
