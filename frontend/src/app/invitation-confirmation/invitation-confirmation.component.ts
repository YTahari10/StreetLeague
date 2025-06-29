import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InvitationService } from '../matches/invitation.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-invitation-confirmation',
  imports: [CommonModule],
  standalone: true,
  template: `

    <div style="max-width: 400px; margin: 100px auto; text-align: center;">
      <h2 *ngIf="status === 'success'">Merci !</h2>
      <p *ngIf="status === 'success'">
        Votre invitation a bien été {{ action === 'accept' ? 'acceptée' : 'refusée' }}.
      </p>

      <p *ngIf="status === 'error'">Erreur lors de la confirmation. Veuillez réessayer plus tard.</p>

      <p *ngIf="status === 'loading'">Traitement en cours...</p>
    </div>
  `
})
export class InvitationConfirmationComponent implements OnInit {
  status: 'loading' | 'success' | 'error' = 'loading';
  action: 'accept' | 'refuse' = 'accept';

  constructor(
    private route: ActivatedRoute,
    private invitationService: InvitationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const invitationId = this.route.snapshot.paramMap.get('invitationId');
    const url = this.router.url; // récupère l'URL complète

    if (url.includes('/accept/')) {
      this.action = 'accept';
    } else if (url.includes('/refuse/')) {
      this.action = 'refuse';
    }

    if (invitationId) {
      if (this.action === 'accept') {
        this.invitationService.acceptInvitation(invitationId).subscribe({
          next: (res) => {
            console.log('Accept full response:', res);
            if (res.status >= 200 && res.status < 300) {
              console.log('Body:', res.body);  // Ici tu devrais voir "Invitation acceptée"
              this.status = 'success';
            } else {
              this.status = 'error';
            }
          },
          error: (err) => {
            console.error('Erreur acceptInvitation:', err);
            this.status = 'error';
          }
        });

      } else if (this.action === 'refuse') {
        this.invitationService.refuseInvitation(invitationId).subscribe({
          next: () => (this.status = 'success'),
          error: () => (this.status = 'error'),
        });
      }
    } else {
      this.status = 'error';
    }
  }
}
