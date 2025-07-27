export interface Match {
  id: string;
  equipeA: string;
  equipeB: string;
  heure: string;
}

export interface Event {
  id?: string;
  nom: string;
  sport: string;
  lieu: string;
  dateHeure: string;
  dateDebut?: string;
  dateFin?: string;
  description: string;
  matchs?: Match[]; // ⬅️ Ajouté ici
}
