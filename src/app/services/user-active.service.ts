import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { AuthUser } from '../models/auth_user';

@Injectable({
  providedIn: 'root'
})
export class UserActiveService {

  // keeps the last amount issued and issues that amount immediately to new subscribers
  private selectedUserSubject: BehaviorSubject<AuthUser | null> = new BehaviorSubject<AuthUser | null>(null);

  // interface that allows subscribe and receive updates when the value changes
  selectedUser$: Observable<AuthUser | null> = this.selectedUserSubject.asObservable();

  constructor() { }

  setSelectedUser(user: AuthUser | null) {
    this.selectedUserSubject.next(user);
  }

  getSelectedUser(): Observable<AuthUser | null> {
    return this.selectedUserSubject.asObservable();
  }

  isAdmin(): Observable<boolean> {
    return this.selectedUser$.pipe(
      map(user => user?.role === 'admin')
    );
  }
}
