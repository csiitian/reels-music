package com.example.demo.controller;

import com.example.demo.service.MediaService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/media")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:3000")
public class MediaController {
  private final MediaService mediaService;

  @PostMapping("/upload")
  public String uploadFile(@RequestParam("file") MultipartFile file) {
    return mediaService.uploadFile(file);
  }
}
