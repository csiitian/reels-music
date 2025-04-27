package com.example.demo.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import lombok.Data;

@Entity
@Data
public class Song {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "song_seq_generator")
    @SequenceGenerator(name = "song_seq_generator", sequenceName = "song_seq", allocationSize = 1)
    private Long id;
    private String title;
    private String artist;
    private String album;
    private String songUrl;
    private String thumbnailUrl;

    @Override
    public String toString() {
        return "Song{" +
            "id=" + id +
            ", title='" + title + '\'' +
            ", artist='" + artist + '\'' +
            ", album='" + album + '\'' +
            ", songUrl='" + songUrl + '\'' +
            ", thumbnailUrl='" + thumbnailUrl + '\'' +
            '}';
    }
}