   package com.streetleague.controller;

import com.streetleague.model.Match;
import com.streetleague.service.MatchService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

   import java.util.List;
   import java.util.Optional;

   @CrossOrigin(origins = "http://localhost:4200")
   @RestController
   @RequestMapping("/api/matches")
   public class MatchController {

      @Autowired
      private MatchService matchService;

      // ✅ Créer un match (POST /api/matchs)
      @PostMapping
      public Match createMatch(@RequestBody Match match) {
         return matchService.ajouterMatch(match);
      }


      // ✅ Supprimer un match par ID (DELETE /api/matchs/{id})
      @DeleteMapping("/{id}")
      public void deleteMatch(@PathVariable String id) {
         matchService.supprimerMatch(id);
      }


      // ✅ Obtenir un match par ID (GET /api/matchs/{id})
      @GetMapping("/{id}")
      public Match getMatchById(@PathVariable String id) {
         return matchService.getMatchById(id).orElse(null);
      }
   @GetMapping
   @PreAuthorize("hasRole('admin') or hasRole('organizer') or hasRole('coach')")
   public List<Match> getAllMatches() {
      return matchService.getAllMatches();
   }

   @GetMapping("/event/{eventId}")
   public List<Match> getMatchesByEvent(@PathVariable String eventId) {
      return matchService.getMatchesByEvent(eventId);
   }

   // ✅ Modifier un match par ID (PUT /api/matches/{id})
   @PutMapping("/{id}")
   @PreAuthorize("hasRole('admin') or hasRole('organizer')")
   public ResponseEntity<Match> updateMatch(@PathVariable String id, @RequestBody Match match) {
      Optional<Match> updatedMatch = matchService.modifierMatch(id, match);
      return updatedMatch.map(ResponseEntity::ok)
                        .orElse(ResponseEntity.notFound().build());
   }
}
