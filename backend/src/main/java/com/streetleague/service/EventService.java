package com.streetleague.service;

import com.streetleague.model.Event;
import com.streetleague.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.logging.Logger;

@Service
public class EventService {

    private final Logger logger = Logger.getLogger(EventService.class.getName());

    @Autowired
    private EventRepository eventRepository;

    public List<Event> getAllEvents() {
        logger.info("Service: récupération de tous les événements");
        return eventRepository.findAll();
    }

    public Optional<Event> getEventById(String id) {
        logger.info("Service: recherche event avec id = " + id);
        Optional<Event> event = eventRepository.findById(id);
        if(event.isEmpty()) {
            logger.warning("Service: aucun event trouvé pour l'id : " + id);
        }
        return event;
    }

    public Event createEvent(Event event) {
        logger.info("Service: création de l'event : " + event);
        Event saved = eventRepository.save(event);
        logger.info("Service: event sauvegardé avec ID = " + saved.getId());
        return saved;
    }

    public Event updateEvent(String id, Event updatedEvent) {
        logger.info("Service: mise à jour de l'event avec id = " + id);
        return eventRepository.findById(id)
                .map(existingEvent -> {
                    existingEvent.setNom(updatedEvent.getNom());
                    existingEvent.setSport(updatedEvent.getSport()); // nouveau champ
                    existingEvent.setDescription(updatedEvent.getDescription());
                    existingEvent.setDateHeure(updatedEvent.getDateHeure()); // nouveau champ
                    existingEvent.setLieu(updatedEvent.getLieu());
                    Event saved = eventRepository.save(existingEvent);
                    logger.info("Service: event mis à jour avec succès");
                    return saved;
                })
                .orElseGet(() -> {
                    logger.warning("Service: event non trouvé pour mise à jour avec id : " + id);
                    return null;
                });
    }

    public boolean deleteEvent(String id) {
        logger.info("Service: suppression de l'event avec id = " + id);
        if(eventRepository.existsById(id)) {
            eventRepository.deleteById(id);
            logger.info("Service: event supprimé avec succès");
            return true;
        } else {
            logger.warning("Service: event non trouvé pour suppression avec id : " + id);
            return false;
        }
    }
}