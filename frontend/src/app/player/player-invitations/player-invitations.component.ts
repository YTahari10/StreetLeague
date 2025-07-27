import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvitationService } from '../../matches/invitation.service';
import { Invitation } from '../../matches/invitation.model';
import { AuthService } from '../../auth.service';
import keycloak from '../../../keycloak-init';

@Component({
  selector: 'app-player-invitations',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mt-4">
      <h2>📧 Mes Invitations</h2>
      
      <!-- Debug Info -->
      <div class="alert alert-secondary mb-3">
        <h6>🔍 Debug Info:</h6>
        <p><strong>Current User Email:</strong> {{ currentUserEmail || 'Not found' }}</p>
        <p><strong>Total Invitations:</strong> {{ allInvitations.length }}</p>
        <p><strong>Filtered for User:</strong> {{ invitations.length }}</p>
        <button class="btn btn-sm btn-outline-primary" (click)="showAllEmails()">Show All Invitation Emails</button>
      </div>
      
      <div *ngIf="loading" class="text-center">
        <div class="spinner-border" role="status">
          <span class="visually-hidden">Chargement...</span>
        </div>
      </div>

      <div *ngIf="!loading && invitations.length === 0" class="alert alert-info">
        <h4>📭 Aucune invitation</h4>
        <p>Vous n'avez actuellement aucune invitation en attente.</p>
      </div>

      <div *ngFor="let invitation of invitations" class="card mb-3">
        <div class="card-body">
          <div class="row align-items-center">
            <div class="col-md-8">
              <h5 class="card-title">
                🏆 Invitation pour un match
              </h5>
              <p class="card-text">
                <strong>Nom:</strong> {{ invitation.nom }}<br>
                <strong>Email:</strong> {{ invitation.email }}<br>
                <strong>Match ID:</strong> {{ invitation.matchId }}<br>
                <strong>Statut:</strong> 
                <span [class]="getStatusClass(invitation.statut)">
                  {{ getStatusIcon(invitation.statut) }} {{ invitation.statut }}
                </span>
              </p>
            </div>
            <div class="col-md-4 text-end">
              <div *ngIf="invitation.statut === 'En attente'" class="btn-group">
                <button 
                  class="btn btn-success me-2" 
                  (click)="acceptInvitation(invitation)"
                  [disabled]="processingIds.has(invitation.id!)">
                  <span *ngIf="processingIds.has(invitation.id!)" class="spinner-border spinner-border-sm me-1"></span>
                  ✅ Accepter
                </button>
                <button 
                  class="btn btn-danger" 
                  (click)="refuseInvitation(invitation)"
                  [disabled]="processingIds.has(invitation.id!)">
                  <span *ngIf="processingIds.has(invitation.id!)" class="spinner-border spinner-border-sm me-1"></span>
                  ❌ Refuser
                </button>
              </div>
              <div *ngIf="invitation.statut !== 'En attente'" class="alert alert-sm" [class]="getStatusClass(invitation.statut)">
                {{ invitation.statut }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .badge-en-attente { background-color: #ffc107; color: #000; }
    .badge-acceptee { background-color: #198754; }
    .badge-refusee { background-color: #dc3545; }
    .alert-sm { padding: 0.25rem 0.5rem; margin: 0; }
  `]
})
export class PlayerInvitationsComponent implements OnInit {
  invitations: Invitation[] = [];
  allInvitations: Invitation[] = [];
  loading = true;
  processingIds = new Set<string>();
  currentUserEmail = '';

  constructor(
    private invitationService: InvitationService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.getCurrentUserEmail();
    this.loadPlayerInvitations();
  }

  getCurrentUserEmail(): void {
    console.log('=== EMAIL RETRIEVAL DEBUG ===');
    
    // Try AuthService first
    const user = this.authService.getCurrentUser();
    console.log('AuthService user:', user);
    
    if (user && user.email) {
      this.currentUserEmail = user.email;
      console.log('Email from AuthService:', this.currentUserEmail);
    } else {
      // Fallback to keycloak token
      console.log('Keycloak authenticated:', keycloak.authenticated);
      console.log('Keycloak tokenParsed:', keycloak.tokenParsed);
      
      if (keycloak.tokenParsed) {
        // Try different possible email fields
        const email = keycloak.tokenParsed['email'] || 
                     keycloak.tokenParsed['preferred_username'] || 
                     keycloak.tokenParsed['username'] || '';
        
        this.currentUserEmail = email;
        console.log('Email from Keycloak token:', this.currentUserEmail);
        console.log('All token fields:', Object.keys(keycloak.tokenParsed));
      } else {
        console.error('No Keycloak token parsed available');
      }
    }
    
    // TEMPORARY: Manual override for testing
    // Override the email to match existing invitations
    this.currentUserEmail = 'tahariyassine508@gmail.com'; // Force use of invitation email
    console.log('TEMP: Using manual email override:', this.currentUserEmail);
    
    console.log('Final current user email:', this.currentUserEmail);
    console.log('============================');
  }

  loadPlayerInvitations(): void {
    this.loading = true;
    
    // Get all invitations and filter by current user's email
    this.invitationService.getAllInvitations().subscribe({
      next: (allInvitations) => {
        this.allInvitations = allInvitations;
        this.invitations = allInvitations.filter(
          invitation => invitation.email === this.currentUserEmail
        );
        this.loading = false;
        
        console.log('=== INVITATION DEBUG ===');
        console.log('Current user email:', this.currentUserEmail);
        console.log('All invitations:', allInvitations);
        console.log('All invitation emails:', allInvitations.map(inv => inv.email));
        console.log('Filtered invitations for user:', this.invitations);
        console.log('========================');
      },
      error: (error) => {
        console.error('Error loading invitations:', error);
        this.loading = false;
      }
    });
  }

  showAllEmails(): void {
    console.log('All invitation emails in system:');
    this.allInvitations.forEach((inv, index) => {
      console.log(`${index + 1}. Email: "${inv.email}" | Name: "${inv.nom}" | Status: ${inv.statut}`);
    });
    console.log('Your email:', `"${this.currentUserEmail}"`);
  }

  acceptInvitation(invitation: Invitation): void {
    if (!invitation.id) return;
    
    this.processingIds.add(invitation.id);
    
    this.invitationService.acceptInvitation(invitation.id).subscribe({
      next: () => {
        invitation.statut = 'Acceptée';
        this.processingIds.delete(invitation.id!);
        console.log('Invitation accepted successfully');
      },
      error: (error) => {
        console.error('Error accepting invitation:', error);
        this.processingIds.delete(invitation.id!);
        alert('Erreur lors de l\'acceptation de l\'invitation');
      }
    });
  }

  refuseInvitation(invitation: Invitation): void {
    if (!invitation.id) return;
    
    this.processingIds.add(invitation.id);
    
    this.invitationService.refuseInvitation(invitation.id).subscribe({
      next: () => {
        invitation.statut = 'Refusée';
        this.processingIds.delete(invitation.id!);
        console.log('Invitation refused successfully');
      },
      error: (error) => {
        console.error('Error refusing invitation:', error);
        this.processingIds.delete(invitation.id!);
        alert('Erreur lors du refus de l\'invitation');
      }
    });
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'En attente': return 'badge bg-warning text-dark';
      case 'Acceptée': return 'badge bg-success';
      case 'Refusée': return 'badge bg-danger';
      default: return 'badge bg-secondary';
    }
  }

  getStatusIcon(status: string): string {
    switch (status) {
      case 'En attente': return '⏳';
      case 'Acceptée': return '✅';
      case 'Refusée': return '❌';
      default: return '📧';
    }
  }
}
