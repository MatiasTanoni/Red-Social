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

  constructor(private pubService: PublicationsService) { }

  ngOnInit() {
    this.uploadPublications();
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

  manageLike(id: number) {
    this.pubService.toggleLike(id).subscribe(() => this.uploadPublications());
  }

  manageDelete(id: number) {
    this.pubService.deletePublication(id).subscribe(() => this.uploadPublications());
  }
}
