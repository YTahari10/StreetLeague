import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-access-denied',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <div class="alert alert-danger text-center">
            <h2>🚫 Accès Refusé</h2>
            <p>Désolé, vous n'avez pas les permissions nécessaires pour accéder à cette page.</p>
            <p><strong>Votre rôle:</strong> {{ authService.getPrimaryRole() }}</p>
            
            <div class="mt-4">
              <a routerLink="/matches" class="btn btn-primary me-2">🏠 Retour aux Matchs</a>
              <button (click)="authService.logout()" class="btn btn-secondary">🚪 Déconnexion</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .alert {
      border-radius: 10px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
  `]
})
export class AccessDeniedComponent {
  constructor(public authService: AuthService) {}
}
