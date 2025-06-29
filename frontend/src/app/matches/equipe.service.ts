import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Equipe {
  id: string;
  nom: string;
  niveau: string;
  coach: string;
}

@Injectable({
  providedIn: 'root'
})
export class EquipeService {
  private apiUrl = 'http://localhost:8060/api/equipes';

  constructor(private http: HttpClient) {}

  getById(id: string): Observable<Equipe> {
    return this.http.get<Equipe>(`${this.apiUrl}/${id}`);
  }

  // Tu peux ajouter d'autres méthodes CRUD si besoin (ex : getAll, create, update, delete)
}
