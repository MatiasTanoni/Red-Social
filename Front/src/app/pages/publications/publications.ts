import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { PublicationsService, Publication } from '../../service/publications-service';
import { PublicationComponent } from './components/publication-component/publication-component';
import { FormsModule } from '@angular/forms';
import { signal } from '@angular/core';
import { Auth } from '../../service/auth';
import { Spinner } from "../../components/spinner/spinner";
import { Router } from '@angular/router';

@Component({
  selector: 'app-publications',
  templateUrl: './publications.html',
  styleUrls: ['./publications.css'],
  imports: [PublicationComponent, FormsModule, Spinner]
})
export class Publications implements OnInit {
  publications: Publication[] = [];

  page = 1;
  limit = 3;
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
    private cdr: ChangeDetectorRef,
    private router: Router
  ) { }

  ngOnInit() {
    // Obtener usuario
    const currentUser = this.auth.getUser();

    // Si NO hay usuario → redirigir
    if (!currentUser) {
      this.router.navigate(['/auth']);
      return;
    }

    // Setear usuario si existe
    this.user.set(currentUser);
    this.username = currentUser.username;
    this.firstName = currentUser.name;
    this.lastName = currentUser.lastName;
    this.idUser = currentUser.id;
    this.profileImage = currentUser.image_url;

    // Cargar publicaciones
    this.page = 1;
    this.uploadPublications();
  }


  uploadPublications() {
    this.loading = true;
    this.pubService.getPublications(this.page, this.orderBy /*, this.limit */).subscribe({
      next: (data) => {
        this.publications = data.slice(0, 3);
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