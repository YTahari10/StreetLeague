package com.streetleague.config;

import com.streetleague.model.Equipe;
import com.streetleague.repository.EquipeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataSeeder implements CommandLineRunner {

    @Autowired
    private EquipeRepository equipeRepository;

    @Override
    public void run(String... args) throws Exception {
        // Only seed data if collection is empty
        if (equipeRepository.count() == 0) {
            seedEquipes();
        }
    }

    private void seedEquipes() {
        // Create realistic teams
        Equipe[] teams = {
            createEquipe("Red Dragons", "Professional", "Marcus Johnson"),
            createEquipe("Blue Thunder", "Semi-Professional", "Sarah Chen"),
            createEquipe("Golden Eagles", "Professional", "David Rodriguez"),
            createEquipe("Silver Wolves", "Amateur", "Emily Davis"),
            createEquipe("Green Panthers", "Semi-Professional", "Michael Brown"),
            createEquipe("Black Hawks", "Professional", "Jessica Wilson"),
            createEquipe("White Tigers", "Amateur", "Carlos Garcia"),
            createEquipe("Purple Lightning", "Semi-Professional", "Amanda Miller"),
            createEquipe("Orange Flames", "Professional", "Robert Taylor"),
            createEquipe("Pink Roses", "Amateur", "Lisa Anderson"),
            createEquipe("Yellow Hornets", "Semi-Professional", "James Thompson"),
            createEquipe("Crimson Sharks", "Professional", "Maria Martinez")
        };

        for (Equipe team : teams) {
            equipeRepository.save(team);
        }

        System.out.println("Seeded " + teams.length + " teams successfully!");
    }

    private Equipe createEquipe(String nom, String niveau, String coach) {
        Equipe equipe = new Equipe();
        equipe.setNom(nom);
        equipe.setNiveau(niveau);
        equipe.setCoach(coach);
        return equipe;
    }
}
