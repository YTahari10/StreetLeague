package com.streetleague.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDateTime;

@Document(collection = "events")
public class Event {

    @Id
    private String id;

    @NotBlank(message = "Le nom de l'événement est requis")
    private String nom;

    @NotBlank(message = "Le sport est requis")
    private String sport;

    @NotBlank(message = "La description est requise")
    private String description;

    @NotNull(message = "La date/heure est requise")
    @JsonFormat(pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime dateHeure;

    @NotBlank(message = "Le lieu est requis")
    private String lieu;

    // Getters et setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getNom() { return nom; }
    public void setNom(String nom) { this.nom = nom; }

    public String getSport() { return sport; }
    public void setSport(String sport) { this.sport = sport; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public LocalDateTime getDateHeure() { return dateHeure; }
    public void setDateHeure(LocalDateTime dateHeure) { this.dateHeure = dateHeure; }

    public String getLieu() { return lieu; }
    public void setLieu(String lieu) { this.lieu = lieu; }

    @Override
    public String toString() {
        return "Event{" +
                "id='" + id + '\'' +
                ", nom='" + nom + '\'' +
                ", sport='" + sport + '\'' +
                ", description='" + description + '\'' +
                ", dateHeure=" + dateHeure +
                ", lieu='" + lieu + '\'' +
                '}';
    }
}