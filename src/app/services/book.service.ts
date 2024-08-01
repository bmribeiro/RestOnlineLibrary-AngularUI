import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Book } from '../models/book';
import { AxiosService } from './axios.service';

@Injectable({
  providedIn: 'root',
})
export class BookService {

  private apiUrl = environment.apiUrl;
  
  constructor(private http: HttpClient, private axiosService: AxiosService) {}

  getBooks(): Observable<Book[]> {

    let headers = new HttpHeaders();

    if (this.axiosService.getAuthToken() !== null) {
      headers = headers.set('Authorization', `Bearer ${this.axiosService.getAuthToken()}`);
    }

    return this.http.get<Book[]>(`${this.apiUrl}/api/books`, { headers });
  }

  getBookById(id : number) : Observable<HttpResponse<Book>>{
    return this.http.get<Book>(`${this.apiUrl}/api/books/${id}`, { observe: 'response'});
  }

  saveBook(book: Book): Observable<Book>{
    return this.http.post<Book>(`${this.apiUrl}/api/books`,book);
  }

  deleteBook(id: number): Observable<HttpResponse<void>> {
    
    // Call
    return this.http.delete<void>(`${this.apiUrl}/api/books/${id}`, { observe: 'response'})
    
    // Chain additional operations to the Observable
    .pipe(

      // Execution errors
      catchError(error => {

        // Book not found
        if (error.status === 404) {
          return throwError(() => new Error('Book not found.'));
        }

        // Other errors
        return throwError(() => new Error('An unexpected error has occurred.'));
      })
    );
  } 
}
