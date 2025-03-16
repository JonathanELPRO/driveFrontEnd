import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { tap, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
  })
  export class AuthService {
  
    private apiUrl = 'http://localhost:3000/auth';  // Cambia a la URL de tu API backend
  
    constructor(private http: HttpClient, private router: Router) {}  

   
    register(email: string, password: string): Observable<any> {
      return this.http.post(`${this.apiUrl}/register`, { email, password });
    }

    login(email: string, password: string, otp?: string): Observable<any> {
      console.log("EMAIL", email);
      console.log("PASSWORD", password);
  
      return this.http.post<any>(`${this.apiUrl}/login`, { email, password, otp }).pipe(
        tap((response) => {
          if (response.token) {
            localStorage.setItem('token', response.token);
            this.router.navigate(['/documents']);
          }
        }),
        catchError((error) => {
          console.log("ERRORAZO",error)
          // Si el error es un 400 o 401, mostramos el mensaje específico
          let errorMessage = 'Error desconocido';  // Mensaje por defecto
  
          if (error.error && error.error.message) {
            if (error.error.message === 'Usuario no encontrado') {
              errorMessage = 'Usuario no encontrado';
            } else if (error.error.message === 'Contraseña incorrecta') {
              errorMessage = 'Contraseña incorrecta';
            } else if (error.error.message === 'OTP incorrecto o expirado') {
              errorMessage = 'OTP incorrecto o expirado';
            }
          }
  
          // Retornamos el error con el mensaje procesado
          return throwError(() => new Error(errorMessage));
        })
      );
    }
  

    logout(): void {
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
    }

    generate2FASecret(email: string): Observable<any> {
      return this.http.post(`${this.apiUrl}/2fa/generate`, { email });
    }
  
    verify2FA(email: string, otp: string): Observable<any> {
        return this.http.post(`${this.apiUrl}/verify2FA`, { email, otp });
      }

      getToken(): string | null {
        return localStorage.getItem('token');
      }

      isAuthenticated(): boolean {
        return !!this.getToken();
      }
  }
  




