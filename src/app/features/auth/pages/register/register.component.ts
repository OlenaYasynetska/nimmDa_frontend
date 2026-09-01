import { Component } from '@angular/core';
import { AuthAccessComponent } from '../../components/auth-access/auth-access.component';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [AuthAccessComponent],
  template: `<app-auth-access initialStatus="new" />`,
})
export class RegisterComponent {}
