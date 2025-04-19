import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AccountService } from '../_services/account.service';
import { NotificationService } from '../_services/notification.service';

export const userGuard: CanActivateFn = (route, state) => {
  const accountService = inject(AccountService);
  const router = inject(Router);
  const notificationService = inject(NotificationService);

  if (accountService.roles().includes('Admin')) {
    return true;
  } else {
    notificationService.notifyOnError('You do not have permission to access this area');
    router.navigateByUrl('/');
    return false;
  }
};
