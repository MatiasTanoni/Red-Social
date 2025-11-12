import { Component, OnInit } from '@angular/core';
import { PublicationsService, Publication } from '../../service/publications-service';
import { PublicationComponent } from './components/publication-component/publication-component';
import { FormsModule } from '@angular/forms';

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

  ActualUser = 'Matias'; // o traelo del servicio de auth
  idUser = localStorage.getItem('id') || '';
  username = localStorage.getItem('username') || '';
  firstName = localStorage.getItem('firstName') || '';
  lastName = localStorage.getItem('lastName') || '';
  profileImage = localStorage.getItem('profileImage') || '';
  text: string = '';

  constructor(private pubService: PublicationsService) { }

  ngOnInit() {
    this.uploadPublications();
  }

  uploadPublications() {
    console.log("hola")
    this.loading = true;
    this.pubService.getPublications(this.page, this.orderBy).subscribe({
      next: (data) => {
        this.publications = data;
        console.log("holaa " + this.publications)
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
    const formData = new FormData();
    formData.append('content', this.text);
    formData.append('username', this.username);
    formData.append('profileImage', this.profileImage);
    formData.append('firstName', this.firstName);
    formData.append('lastName', this.lastName);
    formData.append('idUser', this.idUser);

    // if (this.imageFile) {
    //   formData.append('image', this.imageFile, this.imageFile.name);
    // }

    try {
      const response = await this.pubService.createPost(formData);
      this.text = '';
      // this.imageFile = null;
      // this.imagePreview = null;
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
}
