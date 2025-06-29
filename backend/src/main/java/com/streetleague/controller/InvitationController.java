package com.streetleague.controller;

import com.streetleague.model.Invitation;
import com.streetleague.service.InvitationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.UnsupportedEncodingException;
import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/invitations")
public class InvitationController {
    private static final Logger logger = LoggerFactory.getLogger(InvitationController.class);

    @Autowired
    private InvitationService invitationService;
    /*@Autowired
    private EmailService emailService;*/

    @GetMapping
    public List<Invitation> getAllInvitations() {
        return invitationService.getAllInvitations();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Invitation> getInvitationById(@PathVariable String id) {
        return invitationService.getInvitationById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Invitation createInvitation(@Valid @RequestBody Invitation invitation) throws UnsupportedEncodingException {
        logger.info("Réception d'une nouvelle invitation : {}", invitation);

        Invitation savedInvitation = invitationService.createInvitation(invitation);
        logger.info("Invitation sauvegardée avec ID : {}", savedInvitation.getId());

        // génération des URLs
      /*  String baseUrl = "http://localhost:8060/api/invitations/response";
        String invitationId = URLEncoder.encode(savedInvitation.getId(), StandardCharsets.UTF_8.toString());
        String acceptStatut = URLEncoder.encode("Acceptee", StandardCharsets.UTF_8.toString());
        String refuseStatut = URLEncoder.encode("Refusee", StandardCharsets.UTF_8.toString());

        String acceptUrl = baseUrl + "?invitationId=" + invitationId + "&statut=" + acceptStatut;
        String refuseUrl = baseUrl + "?invitationId=" + invitationId + "&statut=" + refuseStatut;

        logger.info("Liens générés - Accepter: {}, Refuser: {}", acceptUrl, refuseUrl);

        String subject = "Invitation a un match - StreetLeague";

        String htmlBody = "..."; // inchangé

        emailService.sendInvitationEmail(savedInvitation.getEmail(), subject, htmlBody);
        logger.info("Email envoyé à : {}", savedInvitation.getEmail());*/

        return savedInvitation;
    }
    @PutMapping("/{id}")
    public ResponseEntity<Invitation> updateInvitation(@PathVariable String id, @Valid @RequestBody Invitation updatedInvitation) {
        Invitation invitation = invitationService.updateInvitation(id, updatedInvitation);
        return invitation != null ? ResponseEntity.ok(invitation) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInvitation(@PathVariable String id) {
        invitationService.deleteInvitation(id);
        return ResponseEntity.noContent().build();
    }
    @GetMapping("/response")
    public ResponseEntity<String> respondToInvitation(
            @RequestParam String invitationId,
            @RequestParam String statut) {

        logger.info("Réponse reçue pour l'invitation ID={} avec statut={}", invitationId, statut);

        if (!statut.equals("Acceptée") && !statut.equals("Refusée")) {
            logger.warn("Statut invalide reçu : {}", statut);
            return ResponseEntity.badRequest().body("Statut invalide");
        }

        return invitationService.getInvitationById(invitationId)
                .map(invitation -> {
                    logger.info("Invitation trouvée pour mise à jour.");
                    invitation.setStatut(statut);
                    invitationService.updateInvitation(invitationId, invitation);
                    logger.info("Invitation mise à jour avec nouveau statut : {}", statut);
                    return ResponseEntity.ok("Invitation " + statut.toLowerCase());
                })
                .orElseGet(() -> {
                    logger.warn("Invitation non trouvée avec ID : {}", invitationId);
                    return ResponseEntity.notFound().build();
                });
    }

    @GetMapping("/match/{matchId}")
    public ResponseEntity<List<Invitation>> getInvitationsByMatchId(@PathVariable String matchId) {
        logger.info("Recherche des invitations pour matchId = {}", matchId);
        List<Invitation> invitations = invitationService.getInvitationsByMatchId(matchId);
        if (invitations.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(invitations);
    }
    @PatchMapping("/{invitationId}/accept")
    public ResponseEntity<String> acceptInvitation(@PathVariable String invitationId) {
        logger.info("Acceptation invitation ID={}", invitationId);

        return invitationService.getInvitationById(invitationId)
                .map(invitation -> {
                    invitation.setStatut("Acceptée");
                    invitationService.updateInvitation(invitationId, invitation);
                    logger.info("Invitation {} mise à jour en 'Acceptée'", invitationId);
                    return ResponseEntity.ok("Invitation acceptée");
                })
                .orElseGet(() -> {
                    logger.warn("Invitation non trouvée avec ID : {}", invitationId);
                    return ResponseEntity.notFound().build();
                });
    }
    @PatchMapping("/{invitationId}/refuse")
    public ResponseEntity<String> refuseInvitation(@PathVariable String invitationId) {
        logger.info("Refus invitation ID={}", invitationId);

        return invitationService.getInvitationById(invitationId)
                .map(invitation -> {
                    invitation.setStatut("Refusée");
                    invitationService.updateInvitation(invitationId, invitation);
                    logger.info("Invitation {} mise à jour en 'Refusée'", invitationId);
                    return ResponseEntity.ok("Invitation refusée");
                })
                .orElseGet(() -> {
                    logger.warn("Invitation non trouvée avec ID : {}", invitationId);
                    return ResponseEntity.notFound().build();
                });
    }

}