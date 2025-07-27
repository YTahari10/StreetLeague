import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Invitation } from '../invitation.model';
import { HttpClientModule } from '@angular/common/http';
import { InvitationService } from '../invitation.service';
import emailjs from '@emailjs/browser';

@Component({
  selector: 'app-invitations',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, HttpClientModule],
  templateUrl: './invitations.component.html',
  styleUrls: ['./invitations.component.css']
})
export class InvitationsComponent implements OnInit {

  matchId!: string;
  invitations: Invitation[] = [];
  loading = false;
  autoRefresh = true;
  refreshInterval: any;

  newInvitation: Invitation = { nom: '', email: '', statut: 'En attente' };

  constructor(private route: ActivatedRoute, private invitationService: InvitationService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.matchId = params.get('matchId') || '';
      this.loadInvitations();
      this.startAutoRefresh();
    });
  }

  ngOnDestroy(): void {
    this.stopAutoRefresh();
  }

  loadInvitations() {
    this.loading = true;
    this.invitationService.getInvitationsByMatchId(this.matchId).subscribe({
      next: (data) => {
        this.invitations = data;
        this.loading = false;
        console.log('Invitations loaded:', data);
      },
      error: (error) => {
        console.error('Error loading invitations:', error);
        this.loading = false;
        alert('Erreur lors du chargement des invitations.');
      }
    });
  }

  refreshInvitations() {
    console.log('Refreshing invitations...');
    this.loadInvitations();
  }

  startAutoRefresh() {
    if (this.autoRefresh) {
      this.refreshInterval = setInterval(() => {
        this.loadInvitations();
      }, 10000); // Refresh every 10 seconds
    }
  }

  stopAutoRefresh() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  toggleAutoRefresh() {
    this.autoRefresh = !this.autoRefresh;
    if (this.autoRefresh) {
      this.startAutoRefresh();
    } else {
      this.stopAutoRefresh();
    }
  }

  getStatusCount(status: string): number {
    return this.invitations.filter(inv => inv.statut === status).length;
  }

  addInvitation() {
    if (this.newInvitation.nom && this.newInvitation.email) {
      const confirmed = confirm(`Envoyer une invitation à ${this.newInvitation.nom} ?`);

      if (confirmed) {
        // Construire l'objet à envoyer au backend (sans id)
        const invitationToSend: Invitation = {
          ...this.newInvitation,
          matchId: this.matchId,
          equipeInviteeId: 'team789', // à adapter si besoin
          statut: 'En attente'
        };

        // 1. Envoyer au backend (création invitation)
        this.invitationService.sendInvitation(invitationToSend).subscribe({
          next: (createdInvitation) => {
            // 2. Construire les URLs accept/refuse avec l'id retourné
            const acceptUrl = `${window.location.origin}/invitation/accept/${createdInvitation.id}`;
            const refuseUrl = `${window.location.origin}/invitation/refuse/${createdInvitation.id}`;

            // 3. Préparer les données pour EmailJS avec les URLs dynamiques
            const templateParams = {
              name: createdInvitation.nom,
              email: createdInvitation.email,
              matchId: createdInvitation.matchId,
              acceptUrl,
              refuseUrl,
              message: `Bonjour ${createdInvitation.nom},\n
Tu es invité(e) à notre match StreetLeague !\n
Voici ton invitation pour le match ID : ${createdInvitation.matchId}.\n
Merci de répondre rapidement.`
            };

            // 4. Envoyer email via EmailJS
            emailjs.send('service_oohuxye', 'template_1c15ncl', templateParams, 'YQYLdnq_Dicx67hmd')
              .then(() => {
                this.invitations.push(createdInvitation);
                alert(`Invitation envoyée à ${createdInvitation.email}`);
                this.newInvitation = { nom: '', email: '', statut: 'En attente' };
              })
              .catch(() => alert('Impossible d’envoyer le mail d’invitation.'));
          },
          error: () => alert('Erreur lors de l’envoi de l’invitation.')
        });
      }
    }
  }

  removeInvitation(invite: Invitation) {
    const confirmed = confirm(`Supprimer l'invitation de ${invite.nom} ?`);
    if (confirmed) {
      this.invitationService.deleteInvitation(invite.id!).subscribe({
        next: () => {
          this.invitations = this.invitations.filter(i => i !== invite);
          alert('Invitation supprimée.');
        },
        error: () => alert("Erreur lors de la suppression de l'invitation.")
      });
    }
  }
}
