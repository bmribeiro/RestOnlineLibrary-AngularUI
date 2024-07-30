import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Book } from '../models/book';

@Injectable({
  providedIn: 'root',
})
export class BookService {

  private apiUrl = environment.apiUrl;
  
  constructor(private http: HttpClient) {}

  getBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.apiUrl}/api/books`);
  }

  saveBook(book: Book): Observable<Book>{
    return this.http.post<Book>(`${this.apiUrl}/api/books`,book);
  }
}
