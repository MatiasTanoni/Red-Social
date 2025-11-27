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
import { Auth } from '../../service/auth';
import { Router } from '@angular/router';
import { CloudinaryService } from '../../service/cloudinary/cloudinary';
import { firstValueFrom } from 'rxjs';
import { NgZone } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true, // Asumiendo Angular 17+ standalone
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  formulario!: FormGroup;
  registerError: string | null = null;
  selectedFile: File | null = null;
  previewImage: string | null = null;
  users: any[] = [];
  loading = false;

  constructor(private auth: Auth, private cdr: ChangeDetectorRef, private router: Router, private cloudinary: CloudinaryService, private zone: NgZone) { }

  async ngOnInit() {


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
        admin: new FormControl('', [Validators.required]),
        image_url: new FormControl(null, [Validators.required]),
      },
      {
        validators: this.passwordsMatchValidator,
      }
    );
    const res = await firstValueFrom(this.auth.getUsers());
    this.zone.run(() => {
      this.users = res.users;
      this.cdr.detectChanges();
    });

  }

  passwordsMatchValidator(
    control: AbstractControl
  ): ValidationErrors | null {
    const pass = control.get('password')?.value;
    const confirm = control.get('confirmPassword')?.value;
    return pass === confirm ? null : { passwordsMismatch: true };
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.selectedFile = file;

    const reader = new FileReader();

    reader.onload = () => {
      this.previewImage = reader.result as string;

      this.cdr.detectChanges();
    };

    reader.readAsDataURL(file);

    this.formulario.patchValue({
      image_url: file
    });
  }


  removePicture() {
    this.selectedFile = null;
    this.previewImage = null;
    this.formulario.patchValue({ image_url: null });
  }


  async onRegister() {

    this.formulario.markAllAsTouched();

    if (this.formulario.invalid) {
      return;
    }

    let imageUrl: string | null = null;

    if (this.selectedFile) {
      const uploadResponse = await firstValueFrom(this.cloudinary.uploadFile(this.selectedFile));
      imageUrl = uploadResponse.secure_url;
      this.formulario.patchValue({ image_url: imageUrl });
    }

    const formValue = this.formulario.value;
    formValue.admin = formValue.admin === "true";

    const { success, message } = await this.auth.createUser(formValue);
    console.log("🔵 Creando usuario:", success, message);
    if (success) {
      console.log("Usuario creado exitosamente");
      const res = await firstValueFrom(this.auth.getUsers());
      this.users = res.users;
      window.location.reload();
      this.formulario.reset();
      this.selectedFile = null;
      this.previewImage = null;

      this.cdr.detectChanges();
    }


    else {
      console.error('Error en el registro:', message, success);
      if (message === 'User already registered') {
        this.registerError = 'El usuario ya está registrado.';
      } else {
        this.registerError = message;
      }
    }
    this.cdr.detectChanges();
  } catch(error: any) {

    if (error?.error?.message === 'User already registered') {
      this.registerError = 'El usuario ya está registrado.';
    } else if (error?.error?.message) {
      this.registerError = error.error.message;
    } else {
      this.registerError = 'Ocurrió un error inesperado durante el registro.';
    }

    this.cdr.detectChanges();
  }

}