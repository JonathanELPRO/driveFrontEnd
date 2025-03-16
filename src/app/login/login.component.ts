import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email = '';
  password = '';
  otp = '';
  is2FARequired = false;
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin(): void {
    this.authService.login(this.email, this.password).subscribe({
      next: response => {
        if (response.message === '2FA_REQUIRED') {
          this.is2FARequired = true; // Mostrar campo OTP
        }
      },
      error: (error) => {
        this.errorMessage = error.message;  
      }
    });
  }



  verify2FA(): void {
    this.authService.login(this.email, this.password, this.otp).subscribe({
      next: () => console.log('Inicio de sesión exitoso'),
      error: (error) => {
        this.errorMessage = error.message;  
      }
    });
  }
}



  







