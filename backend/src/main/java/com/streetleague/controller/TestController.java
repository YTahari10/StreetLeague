package com.streetleague.controller;

import com.streetleague.model.Equipe;
import com.streetleague.service.EquipeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
@RequestMapping("/test")
    public class TestController {

        @GetMapping("/secured")
        public String secured() {
            return "Hello, this is a secured endpoint!";
        }

        @GetMapping("/public")
        public String publicAccess() {
            return "Hello from a public endpoint!";
        }
    }