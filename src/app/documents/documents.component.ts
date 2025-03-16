import { Component } from '@angular/core';
import { DocumentsService } from '../documents.service';
import { Router } from '@angular/router';  // Asegúrate de importar Router
import { jwtDecode } from "jwt-decode";
import { OnInit } from '@angular/core';
import { SignedDocument } from '../documents.service';

@Component({
  selector: 'app-documents',
  standalone: false,
  templateUrl: './documents.component.html',
  styleUrl: './documents.component.css'
})

export class DocumentsComponent {
  selectedFile: File | null = null;
  owner: string = '';  // Campo para el propietario
  privateKey: string = '';  // Campo para la clave privada
  documents: any[] = [];  // Para almacenar los documentos cargados
  isLoading: boolean = true;  // Para mostrar un indicador de carga mientras se obtienen los documentos
  errorMessage: string = '';  // Para capturar y mostrar posibles errores

  constructor(private documentsService: DocumentsService, private router: Router) {}

  ngOnInit() {
    // Verificar que el token sea válido en el momento de cargar el componente
    this.checkToken();
    this.documentsService.getDocuments().subscribe(
      (data: SignedDocument[]) => {
        this.documents = data;
        this.isLoading = false;
      },
      (error: any) => {
        console.error('Error al obtener documentos:', error);
        this.errorMessage = 'Error al cargar los documentos.';
        this.isLoading = false;
      }
    );
  }

  // Método para verificar si el token es válido
  checkToken() {
    const token = localStorage.getItem('token');
    if (token) {
      // Decodificar el token (opcional) para verificar la expiración en el frontend
      const decodedToken: any = jwtDecode(token);
      
      const currentTime = Math.floor(Date.now() / 1000); // Obtener el tiempo actual en segundos

      if (decodedToken.exp < currentTime) {
        alert('Token expirado, por favor inicia sesión de nuevo.');
        this.router.navigate(['/login']);
      }
      else {
        // Si el token es válido, asignamos el email o el ID del propietario
        this.owner = decodedToken.email; // O decodedToken.sub si es ID de usuario
      }
    } else {
      this.router.navigate(['/login']);
    }
  }

  // Método para manejar la selección de archivo
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }


  loadDocuments() {
    this.documentsService.getDocuments().subscribe({
      next: (response) => {
        this.documents = response; // Asignar los documentos al arreglo
      },
      error: (error) => {
        console.log("ERROR DE CARGAR DOCS",error)
        alert('Error al cargar los documentos');
      }
    });
  }

  onUpload() {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('No estás autenticado. Inicia sesión.');
      this.router.navigate(['/login']);
      return;
    }

    if (this.selectedFile) {

      const formData = new FormData();
    formData.append('file', this.selectedFile); // Asegúrate de que el nombre 'file' coincida con el usado en el backend

      this.documentsService.signDocument(formData).subscribe({
        next: (response) => {
          alert('Documento firmado exitosamente');
        },
        error: (error) => {
          console.log(error)
          alert('Error al firmar el documento');
        }
      });
    } else {
      alert('Por favor, selecciona un archivo, propietario y clave privada');
    }
  }

  logout() {
    // Borra el JWT del localStorage (o sessionStorage si lo usas allí)
    localStorage.removeItem('token');  // O sessionStorage.removeItem('token');
    
    // Redirige al usuario a la página de login
    this.router.navigate(['/login']);
  }

  getFileDownloadLink(fileData: string): string {
    const byteCharacters = atob(fileData); // Decodificar el base64 a caracteres binarios
    const byteArray = new Uint8Array(byteCharacters.length); // Crear un arreglo de bytes de la longitud del archivo
  
    // Llenamos el array con los bytes del archivo
    for (let i = 0; i < byteCharacters.length; i++) {
      byteArray[i] = byteCharacters.charCodeAt(i); // Convertir cada carácter en un byte
    }
  
    const blob = new Blob([byteArray], { type: 'application/pdf' }); // Crear un Blob del tipo adecuado (en este caso, PDF)
    const downloadLink = URL.createObjectURL(blob); // Crear un enlace de descarga
    return downloadLink; // Devuelve el enlace
  }
  


  
}

