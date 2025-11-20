import { ChangeDetectorRef, Component, signal } from '@angular/core';
import { PublicationsService } from '../../service/publications-service';
import { Auth } from '../../service/auth';
import { PublicationComponent } from '../publications/components/publication-component/publication-component';
import { Spinner } from '../../components/spinner/spinner';

export interface Publication {
  _id: number;
  username: string;
  content: string;
  date: Date;
  likes: Array<string>;
  iLike: boolean;
}

@Component({
  selector: 'app-my-profile',
  imports: [PublicationComponent, Spinner],
  templateUrl: './my-profile.html',
  styleUrl: './my-profile.css',
})
export class MyProfile {

  user = signal<any | boolean>(false);
  idUser = '';
  username: any;
  firstName: any;
  lastName: any;
  profileImage: any; // Agregué esto para que no de error en el HTML
  page = 1;
  limit = 3;
  orderBy: 'fecha' | 'likes' = 'fecha';
  loading = false;
  publications: Publication[] = [];
  description: string | null = null;
  constructor(private pubService: PublicationsService, private auth: Auth, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    // 1. Auth
    this.idUser = localStorage.getItem('id') || '';
    this.user.set(this.auth.getUser());

    if (this.user() && typeof this.user() === 'object') {
      this.username = this.user().username;
      this.firstName = this.user().name;
      this.lastName = this.user().lastName;
      this.idUser = this.user().id;
      this.description = this.user().description;
      this.profileImage = this.user().image_url;
    }

    // 2. Cargar publicaciones
    this.page = 1;
    this.uploadPublicationsByUser();
  }

  uploadPublicationsByUser() {
    this.loading = true;
    this.pubService.getPostsByUser(this.idUser).subscribe({
      next: (data) => {
        this.publications = data;
        console.log("Publicaciones del usuario:", this.publications);
        this.publications.forEach(element => {

          console.log("username", element.username);
        });
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

  manageLike() {
    this.uploadPublicationsByUser();
  }

  manageDelete(id: number) {
    this.pubService.deletePublication(id).subscribe(() => this.uploadPublicationsByUser());
  }
}
