package com.example.demo.service;

import org.springframework.web.multipart.MultipartFile;

public interface MediaService {
  String uploadFile(MultipartFile file);
}
