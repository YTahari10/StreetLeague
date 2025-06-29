export interface Match {
  id?: string;
  equipe1Id: string | null;
  equipe2Id: string | null;
  dateHeure: string; // ISO format
  lieu: string;
  statut: string;
  scoreEquipe1: number;
  scoreEquipe2: number;
  convocations: string[];
  eventId: string;
  equipe1Nom?: string;
  equipe2Nom?: string;
}
