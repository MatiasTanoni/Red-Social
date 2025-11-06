import { Component } from '@angular/core';
import { Login } from './components/login/login';
import { Register } from './components/register/register';

@Component({
  selector: 'app-auth',
  imports: [Login, Register],
  templateUrl: './auth.html',
  styleUrl: './auth.css',
})
export class Auth {

  show: 'login' | 'register' = 'login';

}
