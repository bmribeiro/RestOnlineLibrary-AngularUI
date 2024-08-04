import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../models/user';
import { Book } from '../models/book';
import { Reservation } from '../models/reservation';
import { BookRental } from '../models/book-rental.interface';

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
  
  getBooksRentedByUser(userId: number): Observable<BookRental[]> {

    return this.http.get<BookRental[]>(`${this.apiUrl}/api/authUsers/${userId}/rentedBooks`);
  }

  
  
}
