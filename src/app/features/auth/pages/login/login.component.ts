import { Component } from '@angular/core';
import { AuthAccessComponent } from '../../components/auth-access/auth-access.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [AuthAccessComponent],
  template: `<app-auth-access initialStatus="existing" />`,
})
export class LoginComponent {}
