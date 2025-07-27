import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,           // Important pour les standalone components
  imports: [FormsModule]      // <-- importer FormsModule ici
})
export class LoginComponent {
  username = '';
  password = '';

  constructor(private http: HttpClient) {}

  login() {
    this.http.post<any>('http://localhost:8080/api/authenticate', {
      username: this.username,
      password: this.password
    }).subscribe({
      next: (res) => {
        localStorage.setItem('token', res.token);
        alert('Login réussi !');
      },
      error: () => {
        alert('Erreur de connexion');
      }
    });
  }
}
