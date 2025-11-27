import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { PublicationsService } from '../../service/publications-service';
import { PublicationComponent } from './components/publication-component/publication-component';
import { FormsModule } from '@angular/forms';
import { signal } from '@angular/core';
import { Auth } from '../../service/auth';
import { Spinner } from "../../components/spinner/spinner";
import { Router } from '@angular/router';
import { CloudinaryService } from '../../service/cloudinary/cloudinary';
import { firstValueFrom } from 'rxjs';
import { Publication, Comment } from '../../models/publication.model';

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

  admin: any;
  loading = false;
  user = signal<any | boolean>(false);
  selectedPublication: any = null;
  idUser = '';
  username: any;
  firstName: any;
  lastName: any;
  image_url: any;
  text: string = '';
  imagePost: string = '';
  previewImage: string | null = null;
  selectedImage: File | null = null;
  show: boolean = true;

  constructor(
    private pubService: PublicationsService,
    private auth: Auth,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private cloudinary: CloudinaryService
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
    console.log("Usuario:", currentUser);
    this.username = currentUser.username;
    this.firstName = currentUser.name;
    this.lastName = currentUser.lastName;
    this.idUser = currentUser.id;
    this.image_url = currentUser.image_url;
    this.admin = currentUser.admin;

    // Cargar publicaciones
    this.page = 1;
    this.uploadPublications();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    this.selectedImage = file;

    const reader = new FileReader();
    reader.onload = () => {
      this.previewImage = reader.result as string;
      this.cdr.detectChanges();
    };
    reader.readAsDataURL(file);
  }


  uploadPublications() {
    this.loading = true;
    this.pubService.getPublications(this.page, this.orderBy, this.admin /*, this.limit */).subscribe({
      next: (data) => {
        this.publications = data.slice(0, 3);
        console.log("Publicaciones:", this.publications);
        this.loading = false;
        this.cdr.detectChanges();
        console.log("showw", this.publications[0].show)
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

  async post(): Promise<void> {
    if (!this.text.trim() && !this.selectedImage) return;

    try {
      this.loading = true;

      // 1. Subir imagen si existe
      let imagePostUrl: string = '';

      if (this.selectedImage) {
        const uploadResponse = await firstValueFrom(
          this.cloudinary.uploadFile(this.selectedImage)
        );
        imagePostUrl = uploadResponse.secure_url;
      }

      // 2. Crear el post
      const payload = {
        idUser: this.idUser,
        firstName: this.firstName,
        lastName: this.lastName,
        username: this.username,
        content: this.text,
        image_url: this.image_url,   // Imagen del perfil
        imagePost: imagePostUrl      // Imagen del post
      };

      console.log("🔵 Enviando payload:", payload);

      await firstValueFrom(this.pubService.createPost(payload));

      // 3. Reset
      this.text = '';
      this.selectedImage = null;
      this.previewImage = null;
      this.page = 1;

      this.uploadPublications();

    } catch (err) {
      console.error("❌ Error al crear post:", err);
    } finally {
      this.loading = false;
    }
  }


  manageLike() {
    this.uploadPublications();
  }

  manageDelete(id: string) {
    console.log("🔵 Eliminando post con id:", id);
    this.pubService.deletePublication(id).subscribe(() => this.uploadPublications());
  }

  manageDisable(id: string) {
    console.log("🔵 Deshabilitando post con id:", id);
    this.uploadPublications();
    this.cdr.detectChanges();
  }

  removeImage() {
    // lógica futura
  }
}