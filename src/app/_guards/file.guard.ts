import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AccountService } from '../_services/account.service';
import { NotificationService } from '../_services/notification.service';

export const fileGuard: CanActivateFn = (route, state) => {
  const accountService = inject(AccountService);
  const router = inject(Router);
  const notificationService = inject(NotificationService);
  const roles = accountService.roles();

  if (roles.includes('Admin') || roles.includes('Attorney') || roles.includes('Legal Secretary')) {
    return true;
  } else {
    notificationService.notifyOnError('You do not have permission to access this area');
    router.navigateByUrl('/');
    return false;
  }
};
