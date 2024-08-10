import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { catchError, Observable, of, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthorizationService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Put token in Header
  getHeaders(): HttpHeaders {
    let headers = new HttpHeaders();

    const authToken = this.getAuthToken();
    if (authToken !== null) {
      headers = headers.set('Authorization', `Bearer ${authToken}`);
    }
    headers = headers.set('Content-Type', 'application/json');

    return headers;
  }

  // Get Token
  getAuthToken(): string | null {
    return window.localStorage.getItem("auth_token");
  }

  // Set Token
  setAuthToken(token: string | null): void {
    if (token !== null) {
      window.localStorage.setItem("auth_token", token);
    } else {
      window.localStorage.removeItem("auth_token");
    }
  }

  validateToken(): Observable<any> {

    const token = this.getAuthToken();
    return this.http.post(`${this.apiUrl}/validate`, {}, { headers: { Authorization: `Bearer ${token}` }
    })
    
    .pipe(

      tap((response: any) => {
        console.log('Response from validateToken service:', response);
      }),
      
      catchError(error => {
        console.error('Error in validateToken service:', error);
        return of(false);
      })
    );
  }

  // Faz uma requisição HTTP usando HttpClient
  request(method: string, url: string, data: any): Observable<any> {

    const headers = this.getHeaders();

    switch (method.toLowerCase()) {

      case 'post':
        return this.http.post<any>(`${this.apiUrl}${url}`, JSON.stringify(data), { headers });
      case 'get':
        return this.http.get<any>(`${this.apiUrl}${url}`, { headers });
      case 'put':
        return this.http.put<any>(`${this.apiUrl}${url}`, data, { headers });
      case 'delete':
        return this.http.delete<any>(`${this.apiUrl}${url}`, { headers });
      default:
        throw new Error(`Unsupported method: ${method}`);
    }
  }
  
}
