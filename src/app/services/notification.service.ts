import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {

  // Stores the current value and emit that value to new subscribers
  private messageSource = new BehaviorSubject<string | null>(null);

  // To subscribe and receive updates 
  currentMessage: Observable<string | null> = this.messageSource.asObservable();

  constructor() {}

  sendMessage(message: string): void {
    this.messageSource.next(message);
  }

  clearMessage(): void {
    this.messageSource.next(null);
  }
}
