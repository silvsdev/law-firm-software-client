import { Component, inject } from '@angular/core';
import { NotificationService } from '../../_services/notification.service';
import { NotificationModel } from '../../_models/notification.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.css'
})
export class NotificationComponent {
  public notificationService = inject(NotificationService);

  Notification: NotificationModel = {
    message: '',
    type: '',
    show: false,
  };

  notification$ = this.notificationService.notification$;



  //types are error and success

  ngOnInit() {
    this.notification$.subscribe((notification) => {
      this.Notification.message = notification.message;
      this.Notification.type = notification.type;
      this.Notification.show = notification.show;
    });
  }

  closeNotification() {
    this.notificationService.closeNotification();
  }
}

