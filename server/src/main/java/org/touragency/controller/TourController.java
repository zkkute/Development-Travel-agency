package org.touragency.controller;

import org.touragency.model.Tour;
import org.touragency.repository.TourRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tours")
public class TourController {

    @Autowired
    private TourRepository tourRepository;

    @GetMapping
    public List<Tour> getAllTours() {

        logger.info("Fetching all tours");
        return tourRepository.findAll();
    }

    @PostMapping
    public Tour createTour(@RequestBody Tour tour) {
        logger.info("Creating new tour: {}", tour.getDestination());
        return tourRepository.save(tour);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Tour> getTourById(@PathVariable Long id) {
        return tourRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
