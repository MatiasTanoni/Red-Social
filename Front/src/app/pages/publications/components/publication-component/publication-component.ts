import { Component, Input, Output, EventEmitter, importProvidersFrom } from '@angular/core';
import { DatePipe } from '@angular/common';
import { PublicationsService } from '../../../../service/publications-service';
import { FormsModule } from '@angular/forms';
import { Publication, Comment } from '../../../../models/publication.model';
import { ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-publication',
  templateUrl: './publication-component.html',
  styleUrls: ['./publication-component.css'],
  imports: [DatePipe, FormsModule, CommonModule]
})
export class PublicationComponent {
  @Input() publication!: Publication;
  @Input() idUser!: string;
  @Input() username!: string;
  @Input() image_url!: string;
  @Input() itsOwnProfile: boolean = false;
  @Output() like = new EventEmitter<number>();
  @Output() delete = new EventEmitter<string>();
  editingCommentId: string | null = null;
  editingCommentText: string = '';

  constructor(private pubService: PublicationsService, private cdr: ChangeDetectorRef) { }

  onLike(id: string, idUser: string) {
    this.pubService.toggleLike(id, idUser).subscribe((updatedPub: Publication) => {

      this.publication.likes = updatedPub.likes;

      this.like.emit();
    });
  }

  onDelete() {
    this.delete.emit(this.publication._id);
  }

  commentsToShow = 3;

  get visibleComments() {
    return this.publication.comments.slice(0, this.commentsToShow);
  }

  loadMoreComments() {
    this.commentsToShow += 3;
    this.cdr.detectChanges();
  }
  showLessComments() {
    this.commentsToShow = 3;
  }
  commentText: string = '';

  sendComment() {
    if (!this.commentText.trim()) return;

    this.pubService.addComment(this.publication._id,
      {
        image_url: this.image_url,
        idUser: this.idUser,
        username: this.username,
        text: this.commentText.trim()
      }).subscribe((updated: Publication) => {

        this.publication.comments = updated.comments;
        this.commentText = '';
        this.cdr.detectChanges();
      });
  }

  editComment(publicationId: string, commentId: string | undefined, currentText: string) {
    if (!commentId) return;

    this.editingCommentId = commentId;      // activar modo edición
    this.editingCommentText = currentText;  // cargar el texto actual
  }
  saveEditedComment(publicationId: string) {
    this.pubService.editComment(
      publicationId,
      this.editingCommentId!,
      this.editingCommentText.trim()
    ).subscribe((updated: Publication) => {
      this.publication.comments = updated.comments;

      this.editingCommentId = null;
      this.editingCommentText = '';
    });
  }

  cancelEdit() {
    this.editingCommentId = null;
    this.editingCommentText = '';
  }

}