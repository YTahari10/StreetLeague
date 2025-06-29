package com.streetleague.model;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

@Document(collection = "matches")
public class Match {

   @Id
   private String id;

   @NotBlank(message = "L'id de l'équipe 1 est requis")
   private String equipe1Id;

   @NotBlank(message = "L'id de l'équipe 2 est requis")
   private String equipe2Id;

   @NotNull(message = "La date et l'heure sont requises")
   private LocalDateTime dateHeure;

   @NotBlank(message = "Le lieu est requis")
   private String lieu;

   @NotBlank(message = "Le statut est requis")
   private String statut;

   @NotBlank(message = "L'ID de l'événement est requis")
   private String eventId;

   @NotNull(message = "Le score de l'équipe 1 est requis")
   private Integer scoreEquipe1;

   @NotNull(message = "Le score de l'équipe 2 est requis")
   private Integer scoreEquipe2;

   @NotEmpty(message = "Les convocations sont requises")
   @Size(min = 1, message = "Il doit y avoir au moins un joueur convoqué")
   private List<String> convocations;

   // **Nouveaux champs non persistés pour les noms des équipes**
   @Transient
   private String equipe1Nom;

   @Transient
   private String equipe2Nom;

   public String getEquipe1Nom() {
      return equipe1Nom;
   }

   public void setEquipe1Nom(String equipe1Nom) {
      this.equipe1Nom = equipe1Nom;
   }

   public String getEquipe2Nom() {
      return equipe2Nom;
   }

   public void setEquipe2Nom(String equipe2Nom) {
      this.equipe2Nom = equipe2Nom;
   }

   // Getters et setters
   public String getId() {
      return id;
   }
   public void setId(String id) {
      this.id = id;
   }
   public String getEventId() {
      return eventId;
   }

   public void setEventId(String eventId) {
      this.eventId = eventId;
   }

   public String getEquipe1Id() {
      return equipe1Id;
   }
   public void setEquipe1Id(String equipe1Id) {
      this.equipe1Id = equipe1Id;
   }

   public String getEquipe2Id() {
      return equipe2Id;
   }
   public void setEquipe2Id(String equipe2Id) {
      this.equipe2Id = equipe2Id;
   }

   public LocalDateTime getDateHeure() {
      return dateHeure;
   }
   public void setDateHeure(LocalDateTime dateHeure) {
      this.dateHeure = dateHeure;
   }

   public String getLieu() {
      return lieu;
   }
   public void setLieu(String lieu) {
      this.lieu = lieu;
   }

   public String getStatut() {
      return statut;
   }
   public void setStatut(String statut) {
      this.statut = statut;
   }

   public Integer getScoreEquipe1() {
      return scoreEquipe1;
   }
   public void setScoreEquipe1(Integer scoreEquipe1) {
      this.scoreEquipe1 = scoreEquipe1;
   }

   public Integer getScoreEquipe2() {
      return scoreEquipe2;
   }
   public void setScoreEquipe2(Integer scoreEquipe2) {
      this.scoreEquipe2 = scoreEquipe2;
   }

   public List<String> getConvocations() {
      return convocations;
   }
   public void setConvocations(List<String> convocations) {
      this.convocations = convocations;
   }
}