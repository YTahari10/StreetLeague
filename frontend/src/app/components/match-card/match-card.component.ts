import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SportsIconComponent } from '../sports-icons/sports-icon.component';

export interface MatchData {
  id?: string;
  title: string;
  sport: string;
  teamA: string;
  teamB: string;
  date: Date | string;
  time: string;
  location: string;
  status: 'upcoming' | 'live' | 'finished' | 'cancelled';
  scoreA?: number;
  scoreB?: number;
  description?: string;
}

@Component({
  selector: 'app-match-card',
  standalone: true,
  imports: [CommonModule, SportsIconComponent],
  template: `
    <div class="match-card" [class]="'status-' + match.status">
      <div class="match-header">
        <div class="sport-info">
          <app-sports-icon [sport]="match.sport" size="24"></app-sports-icon>
          <span class="sport-name">{{ getSportDisplayName(match.sport) }}</span>
        </div>
        <div class="status-badge" [class]="'status-' + match.status">
          {{ getStatusDisplayName(match.status) }}
        </div>
      </div>
      
      <div class="match-content">
        <h3 class="match-title">{{ match.title }}</h3>
        
        <div class="teams-section">
          <div class="team team-a">
            <div class="team-name">{{ match.teamA }}</div>
            <div class="team-score" *ngIf="match.scoreA !== undefined">
              {{ match.scoreA }}
            </div>
          </div>
          
          <div class="vs-section">
            <span class="vs-text">VS</span>
          </div>
          
          <div class="team team-b">
            <div class="team-name">{{ match.teamB }}</div>
            <div class="team-score" *ngIf="match.scoreB !== undefined">
              {{ match.scoreB }}
            </div>
          </div>
        </div>
        
        <div class="match-details">
          <div class="detail-item">
            <i class="fas fa-calendar"></i>
            <span>{{ formatDate(match.date) }}</span>
          </div>
          <div class="detail-item">
            <i class="fas fa-clock"></i>
            <span>{{ match.time }}</span>
          </div>
          <div class="detail-item">
            <i class="fas fa-map-marker-alt"></i>
            <span>{{ match.location }}</span>
          </div>
        </div>
        
        <div class="match-description" *ngIf="match.description">
          <p>{{ match.description }}</p>
        </div>
      </div>
      
      <div class="match-actions" *ngIf="showActions">
        <button 
          class="btn btn-primary btn-sm"
          (click)="onViewDetails()"
          type="button">
          <i class="fas fa-eye"></i>
          View Details
        </button>
        <button 
          class="btn btn-secondary btn-sm"
          (click)="onEdit()"
          *ngIf="canEdit"
          type="button">
          <i class="fas fa-edit"></i>
          Edit
        </button>
        <button 
          class="btn btn-danger btn-sm"
          (click)="onDelete()"
          *ngIf="canDelete"
          type="button">
          <i class="fas fa-trash"></i>
          Delete
        </button>
      </div>
    </div>
  `,
  styleUrls: ['./match-card.component.css']
})
export class MatchCardComponent {
  @Input() match!: MatchData;
  @Input() showActions: boolean = true;
  @Input() canEdit: boolean = false;
  @Input() canDelete: boolean = false;
  
  @Output() viewDetails = new EventEmitter<MatchData>();
  @Output() edit = new EventEmitter<MatchData>();
  @Output() delete = new EventEmitter<MatchData>();

  constructor(private router: Router) {}

  getSportDisplayName(sport: string): string {
    const sportNames: Record<string, string> = {
      'football': 'Football',
      'basketball': 'Basketball',
      'tennis': 'Tennis',
      'volleyball': 'Volleyball',
      'swimming': 'Swimming',
      'running': 'Running',
      'cycling': 'Cycling',
      'soccer': 'Soccer',
      'baseball': 'Baseball',
      'golf': 'Golf'
    };
    return sportNames[sport] || sport.charAt(0).toUpperCase() + sport.slice(1);
  }

  getStatusDisplayName(status: string): string {
    const statusNames: Record<string, string> = {
      'upcoming': 'Upcoming',
      'live': 'Live',
      'finished': 'Finished',
      'cancelled': 'Cancelled'
    };
    return statusNames[status] || status;
  }

  formatDate(date: Date | string): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  onViewDetails(): void {
    this.viewDetails.emit(this.match);
    if (this.match.id) {
      this.router.navigate(['/matches', this.match.id, 'view']);
    }
  }

  onEdit(): void {
    this.edit.emit(this.match);
    if (this.match.id) {
      this.router.navigate(['/matches', this.match.id, 'edit']);
    }
  }

  onDelete(): void {
    this.delete.emit(this.match);
  }
}
