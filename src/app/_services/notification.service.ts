import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { NotificationModel } from '../_models/notification.model';


@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationSource = new Subject<NotificationModel>();
  notification$ = this.notificationSource.asObservable();
  notification: NotificationModel = {
    message: 'j',
    type: '',
    show: false
  }

  notifyOnError(message: string) {
    this.notification.message = message;
    this.notification.type = 'error';
    this.notification.show = true;
    this.notificationSource.next(this.notification);
    this.timeoutNotification();
  }

  notifyOnSuccess(message: string) {
    this.notification.message = message;
    this.notification.type = 'success';
    this.notification.show = true;
    this.notificationSource.next(this.notification)
    this.timeoutNotification();
  }

  closeNotification() {
    this.notification.message = '';
    this.notification.type = '';
    this.notification.show = false;
    this.notificationSource.next(this.notification);
    this.timeoutNotification();
  }

  timeoutNotification() {
    setTimeout(() => {
      this.notification.message = '';
      this.notification.type = '';
      this.notification.show = false;
      this.notificationSource.next(this.notification);
    }, 3000);
  }
}
