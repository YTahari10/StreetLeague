package com.streetleague.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import jakarta.validation.constraints.NotBlank;

@Document(collection = "equipes")
public class Equipe {

    @Id
    private String id;

    @NotBlank(message = "Le nom de l'équipe est requis")
    private String nom;

    @NotBlank(message = "Le niveau de l'équipe est requis")
    private String niveau;

    @NotBlank(message = "Le coach est requis")
    private String coach;

    // Getters et setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getNiveau() {
        return niveau;
    }

    public void setNiveau(String niveau) {
        this.niveau = niveau;
    }

    public String getCoach() {
        return coach;
    }

    public void setCoach(String coach) {
        this.coach = coach;
    }
}