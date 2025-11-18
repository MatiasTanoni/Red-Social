import { Component, OnInit } from '@angular/core';
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

  idUser = localStorage.getItem('id') || '';
  username: any;
  firstName: any;
  lastName: any;
  profileImage: any;
  text: string = '';

  constructor(private pubService: PublicationsService, private auth: Auth) { }

  ngOnInit() {
    this.uploadPublications();
    this.user.set(this.auth.getUser());
    this.username = this.user() && typeof this.user() === 'object' ? this.user().username : '';
    this.firstName = this.user() && typeof this.user() === 'object' ? this.user().name : '';
    this.lastName = this.user() && typeof this.user() === 'object' ? this.user().lastName : '';
    // this.profileImage = this.user() && typeof this.user() === 'object' ? this.user().profileImage : '';
    this.idUser = this.user() && typeof this.user() === 'object' ? this.user().id : '';
    console.log("firstname", this.firstName);
  }

  uploadPublications() {
    this.loading = true;
    this.pubService.getPublications(this.page, this.orderBy).subscribe({
      next: (data) => {
        this.publications = data;
        this.loading = false;
      },
      error: () => (this.loading = false)
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

  async post(): Promise<void> {
    // console.log("texto", this.text);
    // console.log("username", this.username);
    // console.log("profileImage", this.profileImage);
    // console.log("firstName", this.firstName);
    // console.log("lastName", this.lastName);
    // console.log("idUser", this.idUser);

    const data = {
      content: this.text,
      username: this.username,
      // profileImage: this.profileImage,
      firstName: this.firstName,
      lastName: this.lastName,
      idUser: this.idUser
    };

    // if (this.imageFile) {
    //   formData.append('image', this.imageFile, this.imageFile.name);
    // }

    try {
      const response = await this.pubService.createPost({
        idUser: this.idUser,
        firstName: this.firstName,
        lastName: this.lastName,
        username: this.username,
        content: this.text
      }).subscribe({
        next: (res) => {
          console.log('✅ Respuesta del backend:', res);
        },
        error: (err) => {
          console.error('❌ Error en la petición:', err);
        }
      });
      console.log("response", response);
      this.text = '';

    } catch (error) {
      console.error('Error creando post:', error);
    }
  }

  manageLike(id: number) {
    this.pubService.toggleLike(id).subscribe(() => this.uploadPublications());
  }

  manageDelete(id: number) {
    this.pubService.deletePublication(id).subscribe(() => this.uploadPublications());
  }

  removeImage() {
    console.log("removing image");
    // this.imagePreview = null;
    // this.imageFile = null;
  }
}