// cloudinary.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CloudinaryService {

    private cloudName = 'dqqaf002m';           // ✅ Solo cloudName
    private uploadPreset = 'ml_default';  // Configurado en Cloudinary como unsigned

    constructor(private http: HttpClient) { }

    /**
     * Sube un archivo a Cloudinary usando un unsigned preset
     */
    uploadFile(file: File): Observable<any> {
        const url = `https://api.cloudinary.com/v1_1/${this.cloudName}/upload`;
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', this.uploadPreset); // sin exponer API_SECRET

        return this.http.post(url, formData);
    }

    /**
     * Genera URL de imagen optimizada
     */
    getImageUrl(publicId: string, width?: number, height?: number): string {
        let url = `https://res.cloudinary.com/${this.cloudName}/image/upload/`;
        if (width || height) {
            url += `w_${width || ''},h_${height || ''},c_fill/`;
        }
        url += publicId;
        return url;
    }
}
