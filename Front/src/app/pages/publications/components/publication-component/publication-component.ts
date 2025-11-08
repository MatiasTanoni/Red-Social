import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Publication } from '../../../../service/publications-service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-publicacion',
  templateUrl: './publication-component.html',
  styleUrls: ['./publication-component.css'],
  imports: [DatePipe]
})
export class PublicationComponent {
  @Input() publication!: Publication;
  @Input() itsOwnProfile: boolean = false;
  @Output() like = new EventEmitter<number>();
  @Output() delete = new EventEmitter<number>();

  onLike() {
    this.like.emit(this.publication.id);
  }

  onDelete() {
    this.delete.emit(this.publication.id);
  }
}
