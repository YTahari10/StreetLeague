import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Match } from './match.model';
import {forkJoin, map, Observable, of} from 'rxjs';
import { Equipe, EquipeService } from './equipe.service';
export interface MatchWithEquipes extends Omit<Match, 'equipe1Id' | 'equipe2Id'> {
  equipe1: Equipe | null;
  equipe2: Equipe | null;
}

@Injectable({
  providedIn: 'root'
})
export class MatchService {
  private apiUrl = 'http://localhost:8060/api/matches';

  constructor(private http: HttpClient, private equipeService: EquipeService) {}

  getAll(): Observable<Match[]> {
    return this.http.get<Match[]>(this.apiUrl);
  }

  getById(id: string): Observable<Match> {
    return this.http.get<Match>(`${this.apiUrl}/${id}`);
  }

  create(match: Match): Observable<Match> {
    return this.http.post<Match>(this.apiUrl, match);
  }

  update(id: string, match: Match): Observable<Match> {
    return this.http.put<Match>(`${this.apiUrl}/${id}`, match);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  annuler(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  getMatchWithEquipes(match: Match): Observable<MatchWithEquipes> {
    if (!match.equipe1Id || !match.equipe2Id) {
      // Si pas d'IDs, on retourne le match tel quel avec équipes vides ou null
      return of({
        ...match,
        equipe1: null,
        equipe2: null
      });
    }

    return forkJoin([
      this.equipeService.getById(match.equipe1Id),
      this.equipeService.getById(match.equipe2Id)
    ]).pipe(
      map(([equipe1, equipe2]) => ({
        ...match,
        equipe1,
        equipe2
      }))
    );
  }
  getMatchesByEventId(eventId: string): Observable<Match[]> {
    return this.http.get<Match[]>(`${this.apiUrl}/event/${eventId}`);
  }
}
