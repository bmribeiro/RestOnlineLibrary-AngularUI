import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { BookDetail } from '../models/views/book/book-detail';
import { UserDetail } from '../models/views/user/user-detail';
import { AuthUser } from '../models/auth_user';
import { User } from '../models/views/user/user';

@Injectable({
    providedIn: 'root',
})
export class AdminService {

    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) { }
 
    // Retrieves a list of registered users - Admin Function
    getAuthUsers(): Observable<User[]> {

        return this.http.get<User[]>(`${this.apiUrl}/api/admin/authUsers`);
    }

    // Reservation list for a bookId
    getBookDetailById(id: number): Observable<HttpResponse<BookDetail>> {

        return this.http.get<BookDetail>(`${this.apiUrl}/api/admin/books/${id}/detail`, { observe: 'response' });
    }

    // Reservation list for a userId
    getUserDetailById(id: number): Observable<HttpResponse<UserDetail>> {

        return this.http.get<UserDetail>(`${this.apiUrl}/api/admin/authUsers/${id}/detail`, { observe: 'response' });
    }


}