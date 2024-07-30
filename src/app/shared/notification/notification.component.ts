import { Component, OnDestroy, OnInit } from '@angular/core';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
export class NotificationComponent implements OnInit, OnDestroy {

  // Notification Message
  message: string | null = null;

  constructor(private notificationService : NotificationService){ }

  ngOnInit(): void {
    this.notificationService.currentMessage.subscribe(message => {
      this.message = message;
      if (message) {
        setTimeout(() => {
          this.message = null;
        }, 5000);
      }
    });
  }

  ngOnDestroy(): void {
    this.notificationService.clearMessage();
  }

}
