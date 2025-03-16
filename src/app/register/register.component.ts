import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onRegister() {
    this.authService.register(this.email, this.password).subscribe(response => {
      alert('Registro exitoso. Por favor, verifica tu correo para el código OTP.');
      this.router.navigate(['/login']);  // Redirigir a login después del registro
    }, error => {
      alert('Error al registrar');
      console.error(error);
    });
  }
}


