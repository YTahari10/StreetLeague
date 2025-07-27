import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InvitationService } from '../matches/invitation.service';
import { CommonModule } from '@angular/common';
import keycloak from '../../keycloak-init';


@Component({
  selector: 'app-invitation-confirmation',
  imports: [CommonModule],
  standalone: true,
  template: `
    <div style="max-width: 500px; margin: 100px auto; text-align: center; padding: 20px;">
      <div *ngIf="status === 'success'" class="alert alert-success">
        <h2>✅ Merci !</h2>
        <p>Votre invitation a bien été {{ action === 'accept' ? 'acceptée' : 'refusée' }}.</p>
        <button class="btn btn-primary mt-3" (click)="goToDashboard()">Aller au tableau de bord</button>
      </div>

      <div *ngIf="status === 'error'" class="alert alert-danger">
        <h2>❌ Erreur</h2>
        <p>{{ errorMessage }}</p>
        <div class="mt-3">
          <button class="btn btn-primary me-2" (click)="retry()">Réessayer</button>
          <button class="btn btn-secondary" (click)="goToDashboard()">Tableau de bord</button>
        </div>
      </div>

      <div *ngIf="status === 'loading'" class="alert alert-info">
        <h2>⏳ Traitement en cours...</h2>
        <p>Veuillez patienter pendant que nous traitons votre demande.</p>
      </div>

      <div *ngIf="status === 'auth_required'" class="alert alert-warning">
        <h2>🔐 Authentification requise</h2>
        <p>Vous devez être connecté pour répondre à cette invitation.</p>
        <button class="btn btn-primary mt-3" (click)="login()">Se connecter</button>
      </div>
    </div>
  `
})
export class InvitationConfirmationComponent implements OnInit {
  status: 'loading' | 'success' | 'error' | 'auth_required' = 'loading';
  action: 'accept' | 'refuse' = 'accept';
  errorMessage: string = 'Erreur lors de la confirmation. Veuillez réessayer plus tard.';
  invitationId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private invitationService: InvitationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.invitationId = this.route.snapshot.paramMap.get('invitationId');
    const url = this.router.url;

    if (url.includes('/accept/')) {
      this.action = 'accept';
    } else if (url.includes('/refuse/')) {
      this.action = 'refuse';
    }

    // Check if user is authenticated first
    if (!keycloak.authenticated) {
      console.log('User not authenticated, requiring login...');
      this.status = 'auth_required';
      return;
    }

    this.processInvitation();
  }

  processInvitation(): void {
    if (!this.invitationId) {
      this.status = 'error';
      this.errorMessage = 'ID d\'invitation manquant.';
      return;
    }

    console.log(`Processing invitation ${this.invitationId} - Action: ${this.action}`);

    if (this.action === 'accept') {
      this.invitationService.acceptInvitation(this.invitationId).subscribe({
        next: (res) => {
          console.log('Accept full response:', res);
          if (res.status >= 200 && res.status < 300) {
            console.log('Body:', res.body);
            this.status = 'success';
          } else {
            this.status = 'error';
            this.errorMessage = 'Erreur lors de l\'acceptation de l\'invitation.';
          }
        },
        error: (err) => {
          console.error('Erreur acceptInvitation:', err);
          this.handleError(err);
        }
      });
    } else if (this.action === 'refuse') {
      this.invitationService.refuseInvitation(this.invitationId).subscribe({
        next: (res) => {
          console.log('Refuse response:', res);
          this.status = 'success';
        },
        error: (err) => {
          console.error('Erreur refuseInvitation:', err);
          this.handleError(err);
        }
      });
    }
  }

  handleError(err: any): void {
    this.status = 'error';
    
    if (err.status === 0) {
      this.errorMessage = 'Impossible de contacter le serveur. Vérifiez votre connexion internet et que le serveur backend est démarré.';
    } else if (err.status === 401) {
      this.errorMessage = 'Vous n\'êtes pas autorisé à effectuer cette action. Veuillez vous reconnecter.';
    } else if (err.status === 404) {
      this.errorMessage = 'Invitation non trouvée. Elle a peut-être déjà été traitée.';
    } else {
      this.errorMessage = `Erreur ${err.status}: ${err.message || 'Erreur inconnue'}`;
    }
  }

  retry(): void {
    this.status = 'loading';
    this.processInvitation();
  }

  login(): void {
    keycloak.login();
  }

  goToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }
}
