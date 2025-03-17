import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  email = '';
  password = '';
  otp = '';
  is2FARequired = false;
  errorMessage = '';
  private maxAttempts = 3;
  private blockTime = 5 * 60 * 1000; // 5 minutos en milisegundos
  isBlocked = false;
  remainingTime = 0;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.checkBlockStatus();
  }

  // checkBlockStatus(): void {
  //   const now = Date.now();
  //   const blockUntil = parseInt(localStorage.getItem('blockUntil') || '0', 10);

  //   if (blockUntil > now) {
  //     this.isBlocked = true;
  //     this.updateRemainingTime();
  //     const interval = setInterval(() => {
  //       this.updateRemainingTime();
  //       if (!this.isBlocked) {
  //         clearInterval(interval);
  //       }
  //     }, 1000); // Actualiza cada segundo
  //   } else {
  //     this.isBlocked = false;
  //     localStorage.removeItem('blockUntil');
  //   }
  // }
  checkBlockStatus(): void {
    if (typeof localStorage === 'undefined') return; // Evita error en SSR
  
    const now = Date.now();
    const blockUntil = parseInt(localStorage.getItem('blockUntil') || '0', 10);
  
    if (blockUntil > now) {
      this.isBlocked = true;
      this.updateRemainingTime();
      const interval = setInterval(() => {
        this.updateRemainingTime();
        if (!this.isBlocked) {
          clearInterval(interval);
        }
      }, 1000);
    } else {
      this.isBlocked = false;
      localStorage.removeItem('blockUntil');
    }
  }
  updateRemainingTime(): void {
    const now = Date.now();
    const blockUntil = parseInt(localStorage.getItem('blockUntil') || '0', 10);
    this.remainingTime = Math.ceil((blockUntil - now) / 1000);

    if (this.remainingTime <= 0) {
      this.isBlocked = false;
      localStorage.removeItem('blockUntil');
    }
  }

  // onLogin(): void {
  //   if (this.isBlocked) return; // Evita cualquier intento de login mientras está bloqueado

  //   this.authService.login(this.email, this.password).subscribe({
  //     next: response => {
  //       if (response.message === '2FA_REQUIRED') {
  //         this.is2FARequired = true; // Mostrar campo OTP
  //       } else {
  //         localStorage.setItem('loginAttempts', '0'); // Resetear intentos tras éxito
  //         localStorage.removeItem('blockUntil'); // Eliminar bloqueo si había
  //         this.router.navigate(['/documents']);
  //       }
  //     },
  //     error: (error) => {
  //       this.errorMessage = error.message;

  //       if (error.message === 'Usuario no encontrado') {
  //         alert('Este usuario no está registrado. Verifica el correo.');
  //         return; // No contar intento fallido
  //       }

  //       // Si es error de contraseña incorrecta, contar intentos fallidos
  //       let attempts = parseInt(localStorage.getItem('loginAttempts') || '0', 10);
  //       attempts++;
  //       localStorage.setItem('loginAttempts', attempts.toString());

  //       if (attempts >= this.maxAttempts) {
  //         const blockUntil = Date.now() + this.blockTime;
  //         localStorage.setItem('blockUntil', blockUntil.toString());
  //         this.isBlocked = true;
  //         this.updateRemainingTime();

  //         alert('Has superado el número de intentos. Bloqueo por 5 minutos.');
  //         this.checkBlockStatus();
  //       } else {
  //         alert(`Contraseña incorrecta. Intento ${attempts}/${this.maxAttempts}.`);
  //       }
  //     }
  //   });
  // }

  onLogin(): void {
    if (this.isBlocked) return;
  
    this.authService.login(this.email, this.password).subscribe({
      next: response => {
        if (response.message === '2FA_REQUIRED') {
          this.is2FARequired = true;
        } else {
          if (typeof localStorage !== 'undefined') {
            localStorage.setItem('loginAttempts', '0');
            localStorage.removeItem('blockUntil');
          }
          this.router.navigate(['/documents']);
        }
      },
      error: (error) => {
        this.errorMessage = error.message;
  
        if (error.message === 'Usuario no encontrado') {
          alert('Este usuario no está registrado. Verifica el correo.');
          return;
        }
  
        if (typeof localStorage !== 'undefined') {
          let attempts = parseInt(localStorage.getItem('loginAttempts') || '0', 10);
          attempts++;
          localStorage.setItem('loginAttempts', attempts.toString());
  
          if (attempts >= this.maxAttempts) {
            const blockUntil = Date.now() + this.blockTime;
            localStorage.setItem('blockUntil', blockUntil.toString());
            this.isBlocked = true;
            this.updateRemainingTime();
  
            alert('Has superado el número de intentos. Bloqueo por 5 minutos.');
            this.checkBlockStatus();
          } else {
            alert(`Contraseña incorrecta. Intento ${attempts}/${this.maxAttempts}.`);
          }
        }
      }
    });
  }

  verify2FA(): void {
    this.authService.login(this.email, this.password, this.otp).subscribe({
      next: () => {
        localStorage.setItem('loginAttempts', '0');
        localStorage.removeItem('blockUntil');
        this.router.navigate(['/documents']);
      },
      error: (error) => {
        this.errorMessage = error.message;
      }
    });
  }
}
