import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { PublicationsService, Publication } from '../../service/publications-service';
import { PublicationComponent } from './components/publication-component/publication-component';
import { FormsModule } from '@angular/forms';
import { signal } from '@angular/core';
import { Auth } from '../../service/auth';

@Component({
  selector: 'app-publications',
  templateUrl: './publications.html',
  styleUrls: ['./publications.css'],
  imports: [PublicationComponent, FormsModule] // Asegúrate de que sea Standalone o esté en un módulo
})
export class Publications implements OnInit {
  publications: Publication[] = [];

  // CONFIGURACIÓN DE PAGINACIÓN
  page = 1;
  limit = 3; // <--- AQUÍ DEFINIMOS QUE SOLO SEAN 3
  orderBy: 'fecha' | 'likes' = 'fecha';

  loading = false;
  user = signal<any | boolean>(false);

  idUser = '';
  username: any;
  firstName: any;
  lastName: any;
  profileImage: any; // Agregué esto para que no de error en el HTML
  text: string = '';

  constructor(
    private pubService: PublicationsService,
    private auth: Auth,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    // 1. Auth
    this.idUser = localStorage.getItem('id') || '';
    this.user.set(this.auth.getUser());

    if (this.user() && typeof this.user() === 'object') {
      this.username = this.user().username;
      this.firstName = this.user().name;
      this.lastName = this.user().lastName;
      this.idUser = this.user().id;
      // this.profileImage = this.user().profileImage; 
    }

    // 2. Cargar publicaciones
    this.page = 1;
    this.uploadPublications();
  }

  uploadPublications() {
    this.loading = true;

    // IMPORTANTE: Tu servicio debe aceptar el tercer argumento 'limit'.
    // Si tu servicio actual es getPublications(page, order), deberás modificarlo
    // en el archivo del servicio para que sea: getPublications(page, order, limit)
    // y pasar ese limit al backend.
    this.pubService.getPublications(this.page, this.orderBy /*, this.limit */).subscribe({
      next: (data) => {
        // SI EL BACKEND NO SOPORTA EL LÍMITE:
        // Descomenta la siguiente línea para cortar el array manualmente en el frontend (no es ideal para performance, pero funciona visualmente)
        this.publications = data.slice(0, 3);

        // SI EL BACKEND SOPORTA LÍMITE:
        // this.publications = data;

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        this.cdr.detectChanges();
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
        this.page = 1;
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
    // lógica futura
  }
}