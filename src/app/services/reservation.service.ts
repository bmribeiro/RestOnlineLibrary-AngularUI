import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Reservation } from '../models/reservation';
import { environment } from '../../environments/environment';
import { AxiosService } from './axios.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  private apiUrl = environment.apiUrl;

  constructor(
    private http: HttpClient,
    private axiosService: AxiosService
  ) { }

  // Reserve a book
  reserveBook(reservation: Reservation) : Observable<Reservation>{

    let headers = new HttpHeaders();

    if (this.axiosService.getAuthToken() !== null) {
      headers = headers.set('Authorization', `Bearer ${this.axiosService.getAuthToken()}`);
    }

    // Call
    return this.http.post<Reservation>(`${this.apiUrl}/api/reservations`, reservation, { headers: headers });

  }

  // Return a book
  returnBook(reservation: Reservation) {

    let headers = new HttpHeaders();

    if (this.axiosService.getAuthToken() !== null) {
      headers = headers.set('Authorization', `Bearer ${this.axiosService.getAuthToken()}`);
    }

    // Call
    return this.http.put<Reservation>(`${this.apiUrl}/api/reservation/`, reservation, { headers: headers });
  }
}
