package com.streetleague.service;

import com.streetleague.model.Invitation;
import com.streetleague.repository.InvitationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
@Service
public class InvitationService {
    private static final Logger logger = LoggerFactory.getLogger(InvitationService.class);


    @Autowired
    private InvitationRepository invitationRepository;

  /*  @Autowired
    private EmailService emailService;*/

    public List<Invitation> getAllInvitations() {
        return invitationRepository.findAll();
    }

    public Optional<Invitation> getInvitationById(String id) {
        return invitationRepository.findById(id);
    }


    public Invitation createInvitation(Invitation invitation) {
        logger.info("Création de l'invitation dans MongoDB");
        Invitation savedInvitation = invitationRepository.save(invitation);

        logger.info("Invitation créée avec ID: {}", savedInvitation.getId());

        // génération des liens
        String baseUrl = "http://localhost:8060/api/invitations/response";
        String acceptLink = baseUrl + "?invitationId=" + savedInvitation.getId() + "&statut=Acceptée";
        String refuseLink = baseUrl + "?invitationId=" + savedInvitation.getId() + "&statut=Refusée";

        logger.info("Envoi de l'email avec les liens : {} | {}", acceptLink, refuseLink);

        String subject = "Invitation au match";
        String body = "Bonjour " + savedInvitation.getNom() + ",\n\n" +
                "Tu es invité(e) à notre match StreetLeague !\n\n" +
                "ID du match : " + savedInvitation.getMatchId() + "\n\n" +
                "Email : " + savedInvitation.getEmail() + "\n\n" +
                "Merci de répondre via ces liens :\n" +
                "Accepter : " + acceptLink + "\n" +
                "Refuser : " + refuseLink + "\n\n" +
                "Cordialement,\nL'équipe StreetLeague";

        // Appelle ton service d'envoi mail ici, par exemple :
        // emailService.sendInvitationEmail(savedInvitation.getEmail(), subject, body);

        // Pour l'instant on simule par un log
        logger.info("Email envoyé à {} avec sujet '{}' et corps:\n{}", savedInvitation.getEmail(), subject, body);

        return savedInvitation;
    }

    public Invitation updateInvitation(String id, Invitation updatedInvitation) {
        return invitationRepository.findById(id)
                .map(existingInvitation -> {
                    existingInvitation.setMatchId(updatedInvitation.getMatchId());
                    existingInvitation.setEquipeInviteeId(updatedInvitation.getEquipeInviteeId());
                    existingInvitation.setStatut(updatedInvitation.getStatut());
                    return invitationRepository.save(existingInvitation);
                })
                .orElse(null);
    }

    public void deleteInvitation(String id) {
        invitationRepository.deleteById(id);
    }

    private String recupererEmailEquipe(String equipeInviteeId) {
        // TODO : Implémenter la récupération de l’email de l’équipe via son ID,
        // par exemple en interrogeant la collection équipe (via un repository EquipeRepository)

        // Pour l’instant retourne une valeur de test :
        return "exemple@exemple.com";
    }
    public List<Invitation> getInvitationsByMatchId(String matchId) {
        return invitationRepository.findByMatchId(matchId);
    }

}