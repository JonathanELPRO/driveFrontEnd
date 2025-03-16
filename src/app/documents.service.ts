// src/app/services/documents.service.ts

import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders  } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';  // Asegúrate de importar 'map'


// Define la interfaz para los documentos firmados
export interface SignedDocument {
  _id: string;
  filename: string;
  fileType: string;
  fileData: string;  // Generalmente, se convierte el buffer en base64
  owner: string;
  signature: string;
  publicKey: string;
  encryptedPrivateKey: string;
  createdAt: string;
}

@Injectable({
    providedIn: 'root'
  })
  export class DocumentsService {
  
    private baseUrl = 'http://localhost:3000/documents';  // Aquí es donde tienes tu API de NestJS
  
    constructor(private http: HttpClient) { }
  
    // Método para firmar un documento
    signDocument(selectedFile: FormData | null): Observable<any> {
      console.log("Archivo seleccionado:", selectedFile);  // Agrega este log para inspeccionar el archivo
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
      console.log("Authorization Header:", headers.get('Authorization'));
      return this.http.post(`${this.baseUrl}/sign`, selectedFile, { headers });
    }
  
    // Método para verificar la firma de un documento
    verifyDocument(documentId: string): Observable<any> {
      return this.http.get(`${this.baseUrl}/verify/${documentId}`);
    }

    getDocuments(): Observable<SignedDocument[]> {
      const token = localStorage.getItem('token');
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
      // Fuerza el tipo de respuesta a 'SignedDocument[]' y maneja posibles envoltorios en la respuesta
      return this.http.get<SignedDocument[]>(this.baseUrl, { headers }).pipe(
        map((response: any) => {
          return Array.isArray(response) ? response : response['data'];
        })
      );
    }


  


  }
  