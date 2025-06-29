export interface Invitation {
  nom: string;
  email: string;
  statut: "En attente" | "Acceptée" | "Refusée" | "envoyée";
  matchId?: string;
  equipeInviteeId?: string;
  id?: string;
}
