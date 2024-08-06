import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Reservation } from '../models/reservation';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // Reserve a book
  reserveBook(reservation: Reservation) : Observable<Reservation>{

    // Call
    return this.http.post<Reservation>(`${this.apiUrl}/api/reservations`, reservation);

  }

  // Return a book
  returnBook(reservation: Reservation) {

    // Call
    return this.http.put<Reservation>(`${this.apiUrl}/api/reservations`, reservation);
  }
}
