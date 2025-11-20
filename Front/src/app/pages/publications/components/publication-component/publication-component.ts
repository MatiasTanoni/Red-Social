import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Publication } from '../../../../service/publications-service';
import { DatePipe } from '@angular/common';
import { PublicationsService } from '../../../../service/publications-service';

@Component({
  selector: 'app-publication',
  templateUrl: './publication-component.html',
  styleUrls: ['./publication-component.css'],
  imports: [DatePipe]
})
export class PublicationComponent {
  @Input() publication!: Publication;
  @Input() idUser!: string;
  @Input() itsOwnProfile: boolean = false;
  @Output() like = new EventEmitter<number>();
  @Output() delete = new EventEmitter<number>();

  constructor(private pubService: PublicationsService) { }

  onLike(id: number, idUser: string) {
    this.pubService.toggleLike(id, idUser).subscribe((updatedPub: Publication) => {

      this.publication.likes = updatedPub.likes;

      this.like.emit();
    });
  }


  onDelete() {
    this.delete.emit(this.publication._id);
  }
}
