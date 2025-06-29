package com.streetleague.controller;

import com.streetleague.model.Event;
import com.streetleague.service.EventService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@CrossOrigin(origins = "http://localhost:4200")
@RestController
@RequestMapping("/api/events")
public class EventController {

    @Autowired
    private EventService eventService;

    // GET all events
    @GetMapping
    public List<Event> getAllEvents() {
        return eventService.getAllEvents();
    }

    // GET event by id
    @GetMapping("/{id}")
    public ResponseEntity<Event> getEventById(@PathVariable String id) {
        Optional<Event> event = eventService.getEventById(id);
        return event.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // POST create new event
    @PostMapping
    public Event createEvent(@RequestBody Event event) {
        return eventService.createEvent(event);
    }

    // PUT update event by id
    @PutMapping("/{id}")
    public ResponseEntity<Event> updateEvent(@PathVariable String id, @RequestBody Event updatedEvent) {
        Event event = eventService.updateEvent(id, updatedEvent);
        if(event == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(event);
    }

    // DELETE event by id
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEvent(@PathVariable String id) {
        boolean deleted = eventService.deleteEvent(id);
        if(deleted) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}