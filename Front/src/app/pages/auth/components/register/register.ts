import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import {
  FormsModule,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Auth } from '../../auth'; // servicio cambiarlo dsp con el back etc

@Component({
  selector: 'app-register',
  standalone: true, // Asumiendo Angular 17+ standalone
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register implements OnInit {
  formulario!: FormGroup;
  registerError: string | null = null;
  selectedFile: File | null = null;

  constructor(private auth: Auth, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    this.formulario = new FormGroup(
      {
        name: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(25),
        ]),
        lastName: new FormControl('', [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(25),
        ]),
        username: new FormControl('', [
          Validators.required,
          Validators.minLength(4),
          Validators.maxLength(20),
        ]),
        email: new FormControl('', [Validators.required, Validators.email]),
        password: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
          Validators.pattern(/^(?=.*[A-Z])(?=.*\d).+$/),
        ]),
        confirmPassword: new FormControl('', [Validators.required]),
        birthDate: new FormControl('', [Validators.required]),
        description: new FormControl('', [Validators.required, Validators.maxLength(50)]),
        perfil: new FormControl('usuario', [Validators.required]),
        profileImage: new FormControl(null, [Validators.required]),
      },
      {
        validators: this.passwordsMatchValidator,
      }
    );
  }

  passwordsMatchValidator(
    control: AbstractControl
  ): ValidationErrors | null {
    const pass = control.get('password')?.value;
    const confirm = control.get('confirmPassword')?.value;
    return pass === confirm ? null : { passwordsMismatch: true };
  }

  // Método para capturar el archivo
  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      // Opcional: si quisieras guardar solo el nombre
      // this.formulario.patchValue({ profileImage: this.selectedFile.name });
    }
  }

  async onRegister() {
    // Marcar todos los campos como "tocados" para mostrar errores
    this.formulario.markAllAsTouched();

    if (this.formulario.invalid) {
      console.error('Formulario inválido');
      return;
    }

    // Para enviar un archivo, debes usar FormData
    const formData = new FormData();
    const formValue = this.formulario.value;

    // Agregamos todos los valores del formulario al FormData
    formData.append('name', formValue.name);
    formData.append('lastName', formValue.lastName);
    formData.append('username', formValue.username);
    formData.append('email', formValue.email);
    formData.append('password', formValue.password);
    formData.append('birthDate', formValue.birthDate);
    formData.append('description', formValue.description);
    formData.append('perfil', formValue.perfil);

    // Agregamos el archivo si fue seleccionado
    if (this.selectedFile) {
      formData.append(
        'profileImage',
        this.selectedFile,
        this.selectedFile.name
      );
    }

    console.log('Enviando datos:', formData);

    // --- Lógica de registro (descomentar y adaptar) ---
    // try {
    //   // Tu servicio de 'auth' debería estar preparado para recibir FormData
    //   const { success, message } = await this.auth.register(formData);
    //
    //   if (success) {
    //     // Redirigir al login, al home, etc.
    //   } else {
    //     console.error('Error en el registro:', message);
    //     if (message === 'User already registered') {
    //       this.registerError = 'El usuario ya está registrado.';
    //     } else {
    //       this.registerError = message;
    //     }
    //   }
    //   this.cdr.detectChanges();
    // } catch (error) {
    //   console.error('Error en el registro:', error);
    //   this.registerError = 'Ocurrió un error inesperado durante el registro.';
    //   this.cdr.detectChanges();
    // }
  }
}