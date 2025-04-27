package com.example.demo.service.impl;

import com.example.demo.service.AmazonS3Service;
import com.example.demo.service.MediaService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class MediaServiceImpl implements MediaService {

  private final AmazonS3Service amazonS3Service;

  @Override
  public String uploadFile(MultipartFile file) {
    return amazonS3Service.uploadFile(file);
  }
}
