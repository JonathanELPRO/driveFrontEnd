import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  private maxAttempts = 3; // Número máximo de intentos
  private blockTime = 5 * 60 * 1000; // Tiempo de bloqueo (5 minutos en milisegundos)
  constructor(private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    
    // Verificar si estamos en el navegador antes de acceder a localStorage
    if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
      const token = localStorage.getItem('token');
      const attempts = parseInt(localStorage.getItem('loginAttempts') || '0', 10);
      const blockUntil = parseInt(localStorage.getItem('blockUntil') || '0', 10);
      const now = Date.now();

      // Si la cuenta está bloqueada, verificar si ya se cumplió el tiempo
      if (blockUntil > now) {
        const remainingTime = Math.ceil((blockUntil - now) / 1000); // Segundos restantes
        alert(`Demasiados intentos fallidos. Inténtalo de nuevo en ${Math.ceil(remainingTime / 60)} minutos.`);
        return false;
      }

      if (token) {
        localStorage.setItem('loginAttempts', '0'); // Reinicia intentos en caso de éxito
        // Si el token existe, permite el acceso a la ruta
        return true;
      } else {

        // Si no tiene token y ha alcanzado los intentos máximos, bloquear
        if (attempts >= this.maxAttempts) {
          localStorage.setItem('blockUntil', (now + this.blockTime).toString());
          localStorage.setItem('loginAttempts', '0'); // Resetear intentos tras bloqueo
          alert('Cuenta bloqueada por intentos fallidos. Espera 5 minutos.');
          return false;
        }

        // Si el token no existe, redirige a la página de login
        this.router.navigate(['/login']);
        return false;
      }
    } else {
      // Si no estamos en el navegador, redirige a la página de login
      this.router.navigate(['/login']);
      return false;
    }
  }
}
