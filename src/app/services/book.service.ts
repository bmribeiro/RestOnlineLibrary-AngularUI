import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BookService {
  constructor(private http: HttpClient) {}

  getBooks(): Observable<any> {
    return this.http.get('http://ec2-13-37-239-132.eu-west-3.compute.amazonaws.com:8090/api/books');
  }
}
