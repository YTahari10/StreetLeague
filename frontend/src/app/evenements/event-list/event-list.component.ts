import { Component, OnInit } from '@angular/core';
import { EventService } from '../event.service';
import { Event } from '../event.model';
import { Match } from '../../matches/match.model';
import { MatchService } from '../../matches/match.service';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-event-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit {
  events: Event[] = [];
  filteredEvents: Event[] = [];
  selectedSport: string = '';
  sportsDisponibles: string[] = [];

  matchesByEvent: { [eventId: string]: Match[] } = {};

  constructor(
    private eventService: EventService,
    private matchService: MatchService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.eventService.getAllEvents().subscribe({
      next: (data: Event[]) => {
        this.events = data;
        this.filteredEvents = data;

        // Affichage pour debug dans console
        console.log('Tous les sports dans les événements :', data.map(e => `"${e.sport}"`));

        // Normalisation pour éviter les doublons et erreurs de casse
        this.sportsDisponibles = [...new Set(
          data
            .map((e: Event) => e.sport)
            .filter(sport =>
              sport != null &&
              sport.trim() !== '' &&
              sport.trim().toLowerCase() !== 'null'
            )
            .map(sport => sport.trim().toLowerCase().replace(/^"|"$/g, '')) // suppression guillemets en début/fin
        )];
        console.log('Sports disponibles:', this.sportsDisponibles);

        for (const event of data) {
          this.loadMatchesForEvent(event.id);
        }
      },
      error: (err: any) => {
        console.error('Erreur lors du chargement des événements', err);
      }
    });
  }

  loadMatchesForEvent(eventId: string): void {
    this.matchService.getAll().subscribe({
      next: (matches: Match[]) => {
        this.matchesByEvent[eventId] = matches.filter((m: Match) => m.eventId === eventId);
      },
      error: (err: any) => {
        console.error(`Erreur lors du chargement des matchs de l'événement ${eventId}`, err);
      }
    });
  }

  filterEvents(): void {
    if (!this.selectedSport) {
      this.filteredEvents = this.events;
    } else {
      const normalizedSelectedSport = this.selectedSport.trim().toLowerCase();
      this.filteredEvents = this.events.filter((e: Event) => {
        return e.sport?.trim().toLowerCase() === normalizedSelectedSport;
      });
    }
  }

  goToCreate(): void {
    this.router.navigate(['/evenements/create']);
  }

  onEdit(id: string): void {
    this.router.navigate(['/evenements/edit', id]);
  }

  onDelete(id: string): void {
    if (confirm('Voulez-vous vraiment supprimer cet événement ?')) {
      this.eventService.deleteEvent(id).subscribe(() => {
        this.loadEvents();
      });
    }
  }

  onShare(event: Event): void {
    alert(`Lien de partage généré pour : ${event.nom}`);
  }

  addMatch(eventId: string): void {
    this.router.navigate(['matches/new/:eventId'], { queryParams: { eventId } });
  }

  sportIcons: { [key: string]: string } = {
    'football': '⚽',
    'basket': '🏀',
    'tennis': '🎾',
    'musculation': '🏋️‍♂️',  // Icône haltérophilie (musculation)
    'natation': '🏊‍♂️',     // Icône nageur (natation)
  };

  getSportLabel(sport: string): string {
    if (!sport) return '';

    const cleanSport = sport.trim().toLowerCase().replace(/^"|"$/g, '');

    const displaySport = cleanSport.charAt(0).toUpperCase() + cleanSport.slice(1);

    return `${this.sportIcons[cleanSport] ?? ''} ${displaySport}`;
  }
  goToList(eventId: string): void {
    this.router.navigate(['/matches'], { queryParams: { eventId } });
  }
}
