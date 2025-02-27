import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AccountService } from '../_services/account.service';

export const authGuard: CanActivateFn = (route, state) => {
  const accountService = inject(AccountService);
  const router = inject(Router);

  if (accountService.currentUser()) {
    return true;
  } else {
    // toastr.error('You shall not pass!');
    router.navigate(['/auth/login']),
    console.log('You shall not pass!');
    return false;
  }
};
