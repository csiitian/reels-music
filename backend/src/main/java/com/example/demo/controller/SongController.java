package com.example.demo.controller;

import com.example.demo.model.Song;
import com.example.demo.service.SongService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/songs")
@CrossOrigin(origins = "http://localhost:3000")
public class SongController {
    @Autowired
    private SongService songService;

    @GetMapping
    public List<Song> getAllSongs() {
        return songService.getAllSongs();
    }

    @PostMapping
    public Song addSong(@RequestBody Song song) {
        log.info("Adding song: {}", song);
        return songService.addSong(song);
    }

    @GetMapping("/{id}")
    public Song getSong(@PathVariable Long id) {
        return songService.getSong(id);
    }

    @PutMapping("/{id}")
    public Song updateSong(@PathVariable Long id, @RequestBody Song song) {
        return songService.updateSong(id, song);
    }

    @DeleteMapping("/{id}")
    public void deleteSong(@PathVariable Long id) {
        songService.deleteSong(id);
    }
}
