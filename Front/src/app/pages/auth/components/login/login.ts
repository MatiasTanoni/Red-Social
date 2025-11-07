import { Component, ChangeDetectorRef } from '@angular/core';
import {
  FormsModule,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Auth } from '../../../../service/auth';
import { Router } from '@angular/router';
import { Alert } from '../../../../components/alert/alert';

@Component({
  selector: 'app-login',
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  formularioLogin!: FormGroup;
  password: string = '';
  email: string = '';
  loginError: string | null = null;

  quickUsers = [
    { email: 'admin@test.com', password: '123456', label: 'Admin' },
    { email: 'user@test.com', password: '123456', label: 'Usuario' },
    { email: 'guest@test.com', password: '123456', label: 'Invitado' },
  ];

  constructor(private auth: Auth, private cdr: ChangeDetectorRef, private router: Router) {
  }

  ngOnInit() {
    this.formularioLogin = new FormGroup({
      email: new FormControl(this.email, [
        Validators.required,
        Validators.email,
      ]),
      password: new FormControl(this.password, [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d).+$/) // al menos 1 mayúscula y 1 número
      ]),
    });
  }

  async onLogin() {
    const { email, password } = this.formularioLogin.value;
    await this.doLogin(email, password);
  }

  async onQuickLogin(user: { email: string; password: string }) {
    await this.doLogin(user.email, user.password);
  }

  private async doLogin(email: string, password: string) {
    try {
      const { success, message } = await this.auth.login(email, password);

      if (success) {
        this.loginError = null;
        this.cdr.detectChanges();

        this.router.navigate(['/publications']);
      } else {
        this.loginError = message;
        this.cdr.detectChanges();
      }
    } catch (error) {
      this.loginError = "Ocurrió un error inesperado al iniciar sesión.";
      console.error("Excepción en login:", error);
      this.cdr.detectChanges();
    }
  }

}
