import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Invitation } from './invitation.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InvitationService {
  private apiUrl = 'http://localhost:8060/api/invitations';  // URL backend à adapter

  constructor(private http: HttpClient) {}

  sendInvitation(invitation: Invitation): Observable<Invitation> {
    return this.http.post<Invitation>(`${this.apiUrl}`, invitation);
  }

  getAllInvitations(): Observable<Invitation[]> {
    return this.http.get<Invitation[]>(this.apiUrl);
  }
  getInvitationsByMatchId(matchId: string): Observable<Invitation[]> {
    return this.http.get<Invitation[]>(`http://localhost:8060/api/invitations/match/${matchId}`);
  }
  deleteInvitation(id: string): Observable<void> {
    return this.http.delete<void>(`http://localhost:8060/api/invitations/${id}`);
  }
  acceptInvitation(invitationId: string) {
    return this.http.patch(`${this.apiUrl}/${invitationId}/accept`, {}, {
      responseType: 'text',  // <-- ici, dire que c’est du texte brut
      observe: 'response'
    });
  }
  refuseInvitation(invitationId: string) {
    return this.http.patch(`${this.apiUrl}/${invitationId}/refuse`, {}, {
      responseType: 'text',  // <-- ici, dire que c’est du texte brut
      observe: 'response'
    });

  }
}
