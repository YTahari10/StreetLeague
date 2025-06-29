package com.streetleague.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.Document;
import jakarta.validation.constraints.NotBlank;

@Document(collection = "invitations")
public class Invitation {

    @Id
    private String id;

    @NotBlank(message = "L'ID du match est requis")
    private String matchId;

    @NotBlank(message = "L'ID de l'équipe invitée est requis")
    private String equipeInviteeId;

    @NotBlank(message = "Le statut est requis (envoyée, acceptée, refusée)")
    private String statut;

    @NotBlank(message = "Le nom est requis")
    private String nom;

    @NotBlank(message = "L'email est requis")
    private String email;
    @Transient
    private String acceptLink;

    @Transient
    private String refuseLink;


    // Getters et setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getMatchId() {
        return matchId;
    }

    public void setMatchId(String matchId) {
        this.matchId = matchId;
    }

    public String getEquipeInviteeId() {
        return equipeInviteeId;
    }

    public void setEquipeInviteeId(String equipeInviteeId) {
        this.equipeInviteeId = equipeInviteeId;
    }

    public String getStatut() {
        return statut;
    }

    public void setStatut(String statut) {
        this.statut = statut;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAcceptLink() {
        return acceptLink;
    }

    public void setAcceptLink(String acceptLink) {
        this.acceptLink = acceptLink;
    }

    public String getRefuseLink() {
        return refuseLink;
    }

    public void setRefuseLink(String refuseLink) {
        this.refuseLink = refuseLink;
    }
}