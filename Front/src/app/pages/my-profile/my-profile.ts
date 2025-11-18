import { ChangeDetectorRef, Component, signal } from '@angular/core';
import { PublicationsService, Publication } from '../../service/publications-service';
import { Auth } from '../../service/auth';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-my-profile',
  imports: [DatePipe],
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
      // this.profileImage = this.user().profileImage; 
    }

    // 2. Cargar publicaciones
    this.page = 1;
    this.uploadPublicationsByUser();
  }

  uploadPublicationsByUser() {
    this.loading = true;
    this.pubService.getPostsByUser(this.user().id).subscribe({
      next: (data) => {
        this.publications = data as any[];
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
}
