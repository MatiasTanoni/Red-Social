import { Component, Input, Output, EventEmitter, importProvidersFrom } from '@angular/core';
import { DatePipe } from '@angular/common';
import { PublicationsService } from '../../../../service/publications-service';
import { FormsModule } from '@angular/forms';
import { Publication, Comment } from '../../../../models/publication.model';

@Component({
  selector: 'app-publication',
  templateUrl: './publication-component.html',
  styleUrls: ['./publication-component.css'],
  imports: [DatePipe, FormsModule]
})
export class PublicationComponent {
  @Input() publication!: Publication;
  @Input() idUser!: string;
  @Input() itsOwnProfile: boolean = false;
  @Output() like = new EventEmitter<number>();
  @Output() delete = new EventEmitter<string>();

  constructor(private pubService: PublicationsService) { }

  onLike(id: string, idUser: string) {
    this.pubService.toggleLike(id, idUser).subscribe((updatedPub: Publication) => {

      this.publication.likes = updatedPub.likes;

      this.like.emit();
    });
  }

  onDelete() {
    this.delete.emit(this.publication._id);
  }

  commentText: string = '';

  sendComment() {
    if (!this.commentText.trim()) return;

    this.pubService.addComment(this.publication._id, {
      idUser: this.idUser,
      username: this.publication.username,
      text: this.commentText.trim()
    }).subscribe((updated: Publication) => {

      this.publication.comments = updated.comments;
      this.commentText = '';
    });
  }

}
