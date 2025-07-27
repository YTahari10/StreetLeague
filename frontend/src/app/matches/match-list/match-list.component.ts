import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Match } from '../match.model';
import { MatchService, MatchWithEquipes } from '../match.service';
import { AuthService } from '../../auth.service';

@Component({
  selector: 'app-match-list',
  standalone: true,
  imports: [CommonModule, HttpClientModule, RouterModule],
  templateUrl: './match-list.component.html',
  styleUrls: ['./match-list.component.css']
})
export class MatchListComponent implements OnInit {
  matches: MatchWithEquipes[] = [];
  isFilteredByEvent = false; // Track if we're filtering by eventId
  private router = inject(Router);
  private matchService = inject(MatchService);
  private route = inject(ActivatedRoute);
  public authService = inject(AuthService);
  
  // User information
  currentUser = this.authService.getCurrentUser();
  
  constructor() {
    // Role-based access control is now working correctly
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const eventId = params['eventId'];

if (eventId) {
        this.isFilteredByEvent = true; // Set the flag to true when filtering by eventId
        // Charge uniquement les matchs liés à l'événement
        this.matchService.getMatchesByEventId(eventId).subscribe(data => {
          console.log(`Matches reçus pour eventId=${eventId}:`, data);
          const observables = data.map(match => this.matchService.getMatchWithEquipes(match));
          forkJoin(observables).subscribe(matchesWithEquipes => {
            this.matches = matchesWithEquipes;
          });
        });
      } else {
        // Charge tous les matchs (comportement par défaut)
        this.matchService.getAll().subscribe(data => {
          console.log('Matches reçus:', data);
          const observables = data.map(match => this.matchService.getMatchWithEquipes(match));
          forkJoin(observables).subscribe(matchesWithEquipes => {
            this.matches = matchesWithEquipes;
          });
        });
      }
    });
  }

  deleteMatch(id: string): void {
    if (confirm('Voulez-vous vraiment supprimer ce match ?')) {
      this.matchService.delete(id).subscribe(() => {
        this.matches = this.matches.filter(m => m.id !== id);
      });
    }
  }

  goToCreate(): void {
    console.log('goToCreate called');
    this.router.navigate(['/matches/new']).then(success => {
      if (success) {
        console.log('Navigation réussie');
      } else {
        console.warn('Navigation échouée');
      }
    });
  }

  goToEdit(id: string): void {
    this.router.navigate(['/matches/edit', id]).then(success => {
      if (success) {
        console.log('Navigation vers modification réussie');
      } else {
        console.warn('Navigation vers modification échouée');
      }
    });
  }

  goToView(id: string): void {
    this.router.navigate(['/matches/view', id]).then(success => {
      if (success) {
        console.log('Navigation vers affichage réussie');
      } else {
        console.warn('Navigation vers affichage échouée');
      }
    });
  }

  goToInvitations(matchId: string): void {
    this.router.navigate(['/invitations', matchId]).then(success => {
      if (success) {
        console.log(`Navigation vers invitations du match ${matchId} réussie`);
      } else {
        console.warn(`Navigation vers invitations du match ${matchId} échouée`);
      }
    });
  }

  goToEvents(): void {
    this.router.navigate(['/evenements']).then(success => {
      if (success) {
        console.log('Navigation vers événements réussie');
      } else {
        console.warn('Navigation vers événements échouée');
      }
    });
  }
}
