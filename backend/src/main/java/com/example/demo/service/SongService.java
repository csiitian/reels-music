package com.example.demo.service;

import com.example.demo.model.Song;
import com.example.demo.repository.SongRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SongService {
    @Autowired
    private SongRepository songRepository;

    public List<Song> getAllSongs() {
        return songRepository.findAll();
    }

    public Song addSong(Song song) {
        return songRepository.save(song);
    }

    public Song getSong(Long id) {
        return songRepository.findById(id).orElse(null);
    }

    public Song updateSong(Long id, Song song) {
        Song existingSong = songRepository.findById(id).orElse(null);
        if (existingSong == null) {
            return null;
        }
        existingSong.setTitle(song.getTitle());
        existingSong.setArtist(song.getArtist());
        existingSong.setAlbum(song.getAlbum());
        existingSong.setSongUrl(song.getSongUrl());
        existingSong.setThumbnailUrl(song.getThumbnailUrl());
        return songRepository.save(existingSong);
    }

    public void deleteSong(Long id) {
        songRepository.deleteById(id);
    }
}
