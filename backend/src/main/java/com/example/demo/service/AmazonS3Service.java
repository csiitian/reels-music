package com.example.demo.service;

import java.util.List;
import org.springframework.web.multipart.MultipartFile;

public interface AmazonS3Service {
  List<String> getAllBuckets();
  List<String> getBucketObjects();
  String uploadFile(MultipartFile multipartFile);
  void deleteFile(String key);
  String updateFile(String key, MultipartFile multipartFile);
  String multipartUploadFile(MultipartFile multipartFile);
  String downloadFile(String key);
}
