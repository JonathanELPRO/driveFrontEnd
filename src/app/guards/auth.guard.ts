import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    
    // Verificar si estamos en el navegador antes de acceder a localStorage
    if (typeof window !== 'undefined' && typeof window.localStorage !== 'undefined') {
      const token = localStorage.getItem('token');
      
      if (token) {
        // Si el token existe, permite el acceso a la ruta
        return true;
      } else {
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
