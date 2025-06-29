package com.streetleague.service;

import java.util.List;
import java.util.Optional;

import com.streetleague.model.Equipe;
import com.streetleague.repository.EquipeRepository;
import org.springframework.stereotype.Service;

import com.streetleague.model.Match;
import com.streetleague.repository.MatchRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class MatchService
{
   private final MatchRepository matchRepository;
   private final EquipeRepository equipeRepository;  // Injection repository équipe


   // Planifier un match
   public Match planifierMatch(Match match)
   {
      match.setStatut("planifié");
      return matchRepository.save(match);
   }


   // Modifier un match
   public Optional<Match> modifierMatch(String id, Match matchDetails)
   {
      return matchRepository.findById(id).map(match -> {
         match.setEquipe1Id(matchDetails.getEquipe1Id());
         match.setEquipe2Id(matchDetails.getEquipe2Id());
         match.setDateHeure(matchDetails.getDateHeure());
         match.setLieu(matchDetails.getLieu());
         match.setStatut(matchDetails.getStatut());
         match.setScoreEquipe1(matchDetails.getScoreEquipe1());
         match.setScoreEquipe2(matchDetails.getScoreEquipe2());
         match.setConvocations(matchDetails.getConvocations());
         return matchRepository.save(match);
      });
   }

   // Annuler un match
   public boolean annulerMatch(String id)
   {
      return matchRepository.findById(id).map(match -> {
         match.setStatut("annulé");
         matchRepository.save(match);
         return true;
      }).orElse(false);
   }

   // Ajouter un match (équivalent à planifier)
   public Match ajouterMatch(Match match)
   {
      return planifierMatch(match);
   }

   // Supprimer un match
   public boolean supprimerMatch(String id)
   {
      return matchRepository.findById(id).map(match -> {
         matchRepository.delete(match);
         return true;
      }).orElse(false);
   }

   public List<Match> getAllMatches()
   {
      List<Match> matches = matchRepository.findAll();

      for (Match match : matches) {
         // Récupérer le nom de l'équipe 1
         String nomEquipe1 = equipeRepository.findById(match.getEquipe1Id())
                 .map(Equipe::getNom)
                 .orElse("Équipe inconnue");

         // Récupérer le nom de l'équipe 2
         String nomEquipe2 = equipeRepository.findById(match.getEquipe2Id())
                 .map(Equipe::getNom)
                 .orElse("Équipe inconnue");

         match.setEquipe1Nom(nomEquipe1);
         match.setEquipe2Nom(nomEquipe2);
      }

      return matches;
   }
   public List<Match> getMatchesByEvent(String eventId) {
      List<Match> matches = matchRepository.findByEventId(eventId);

      for (Match match : matches) {
         String nomEquipe1 = equipeRepository.findById(match.getEquipe1Id())
                 .map(Equipe::getNom)
                 .orElse("Équipe inconnue");
         String nomEquipe2 = equipeRepository.findById(match.getEquipe2Id())
                 .map(Equipe::getNom)
                 .orElse("Équipe inconnue");
         match.setEquipe1Nom(nomEquipe1);
         match.setEquipe2Nom(nomEquipe2);
      }

      return matches;
   }

   public Optional<Match> getMatchById(String id)
   {
      return matchRepository.findById(id);
   }


}
