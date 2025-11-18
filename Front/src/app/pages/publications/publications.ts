import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // <--- 1. Importar esto
import { PublicationsService, Publication } from '../../service/publications-service';
import { PublicationComponent } from './components/publication-component/publication-component';
import { FormsModule } from '@angular/forms';
import { signal } from '@angular/core';
import { Auth } from '../../service/auth';

@Component({
  selector: 'app-publications',
  templateUrl: './publications.html',
  styleUrls: ['./publications.css'],
  imports: [PublicationComponent, FormsModule]
})
export class Publications implements OnInit {
  publications: Publication[] = [];
  page = 1;
  orderBy: 'fecha' | 'likes' = 'fecha';
  loading = false;

  user = signal<any | boolean>(false);

  // OJO: Mover el localStorage dentro de ngOnInit es más seguro para evitar errores si usas SSR
  idUser = '';
  username: any;
  firstName: any;
  lastName: any;
  text: string = '';

  constructor(
    private pubService: PublicationsService,
    private auth: Auth,
    private cdr: ChangeDetectorRef // <--- 2. Inyectar aquí
  ) { }

  ngOnInit() {
    console.log("🟢 Iniciando Componente..."); // Debug para confirmar que entra aquí

    // Inicializamos datos del usuario
    this.idUser = localStorage.getItem('id') || '';
    this.user.set(this.auth.getUser());

    if (this.user() && typeof this.user() === 'object') {
      this.username = this.user().username;
      this.firstName = this.user().name;
      this.lastName = this.user().lastName;
      this.idUser = this.user().id;
    }

    this.page = 1;

    // Llamada inicial
    this.uploadPublications();
  }

  uploadPublications() {
    this.loading = true;

    this.pubService.getPublications(this.page, this.orderBy).subscribe({
      next: (data) => {
        console.log('📦 Datos recibidos:', data.length);
        this.publications = data;
        this.loading = false;

        // <--- 3. FORZAR ACTUALIZACIÓN DE LA VISTA
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('❌ Error:', err);
        this.loading = false;
        this.cdr.detectChanges(); // También forzar en error para quitar el loading
      }
    });
  }

  changeOrder(order: 'fecha' | 'likes') {
    this.orderBy = order;
    this.page = 1;
    this.uploadPublications();
  }

  siguientePagina() {
    this.page++;
    this.uploadPublications();
  }

  anteriorPagina() {
    if (this.page > 1) {
      this.page--;
      this.uploadPublications();
    }
  }

  post(): void {
    if (!this.text || !this.text.trim()) return;

    this.pubService.createPost({
      idUser: this.idUser,
      firstName: this.firstName,
      lastName: this.lastName,
      username: this.username,
      content: this.text
    }).subscribe({
      next: (res) => {
        this.text = '';
        this.page = 1; // Volver a la primera página para ver el nuevo post
        this.uploadPublications();
      },
      error: (err) => console.error(err)
    });
  }

  manageLike(id: number) {
    this.pubService.toggleLike(id).subscribe(() => this.uploadPublications());
  }

  manageDelete(id: number) {
    this.pubService.deletePublication(id).subscribe(() => this.uploadPublications());
  }

  removeImage() {
    // lógica de imagen
  }
}