package com.example.demo.service.impl;

import com.example.demo.properties.AwsProperties;
import com.example.demo.service.AmazonS3Service;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.ByteBuffer;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.AbortMultipartUploadRequest;
import software.amazon.awssdk.services.s3.model.Bucket;
import software.amazon.awssdk.services.s3.model.CompleteMultipartUploadRequest;
import software.amazon.awssdk.services.s3.model.CompletedMultipartUpload;
import software.amazon.awssdk.services.s3.model.CompletedPart;
import software.amazon.awssdk.services.s3.model.CreateMultipartUploadRequest;
import software.amazon.awssdk.services.s3.model.CreateMultipartUploadResponse;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.ListObjectsV2Request;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.S3Object;
import software.amazon.awssdk.services.s3.model.StorageClass;
import software.amazon.awssdk.services.s3.model.UploadPartRequest;
import software.amazon.awssdk.services.s3.model.UploadPartResponse;

@Slf4j
@Service
public class AmazonS3ServiceImpl implements AmazonS3Service {

  private final S3Client s3Client;
  private final AwsProperties awsProperties;

  public AmazonS3ServiceImpl(@Qualifier("s3Client") S3Client s3Client, AwsProperties awsProperties) {
    this.s3Client = s3Client;
    this.awsProperties = awsProperties;
  }

  @Override
  public List<String> getAllBuckets() {
    return s3Client.listBuckets().buckets().stream()
        .map(Bucket::name).toList();
  }

  @Override
  public List<String> getBucketObjects() {
    ListObjectsV2Request request = ListObjectsV2Request.builder()
        .bucket(awsProperties.getS3().getBucket())
        .build();

    return s3Client.listObjectsV2(request).contents().stream()
        .map(S3Object::key).toList();
  }

  @Override
  public String uploadFile(MultipartFile multipartFile) {
    try {
      String uniqueFileName = UUID.randomUUID() + "_" + multipartFile.getOriginalFilename();

      PutObjectRequest putObjectRequest = PutObjectRequest.builder()
          .bucket(awsProperties.getS3().getBucket())
          .key(uniqueFileName)
          .contentLength(multipartFile.getSize())
          .storageClass(StorageClass.STANDARD_IA)
          .build();

      s3Client.putObject(putObjectRequest,
          RequestBody.fromBytes(multipartFile.getInputStream().readAllBytes()));
      return "https://" + awsProperties.getS3().getBucket() + ".s3." + awsProperties.getS3().getRegion() + ".amazonaws.com/" + uniqueFileName;
    } catch (IOException e) {
      return e.getMessage();
    }
  }

  @Override
  public void deleteFile(String fileName) {
    DeleteObjectRequest deleteObjectRequest = DeleteObjectRequest.builder()
        .bucket(awsProperties.getS3().getBucket())
        .key(fileName)
        .build();

    s3Client.deleteObject(deleteObjectRequest);
  }

  @Override
  public String updateFile(String fileName, MultipartFile multipartFile) {
    try {
      PutObjectRequest putObjectRequest = PutObjectRequest.builder()
          .bucket(awsProperties.getS3().getBucket())
          .key(fileName)
          .contentLength(multipartFile.getSize())
          .storageClass(StorageClass.GLACIER)
          .build();

      s3Client.putObject(putObjectRequest,
          RequestBody.fromBytes(multipartFile.getInputStream().readAllBytes()));
      return multipartFile.getOriginalFilename() + " Uploaded.";
    } catch (IOException e) {
      return e.getMessage();
    }
  }

  @Override
  public String multipartUploadFile(MultipartFile multipartFile) {
    String bucketName = awsProperties.getS3().getBucket();
    String key = UUID.randomUUID() + "_" + multipartFile.getOriginalFilename();

    CreateMultipartUploadRequest createMultipartUploadRequest = CreateMultipartUploadRequest.builder()
        .bucket(bucketName)
        .key(key)
        .build();

    CreateMultipartUploadResponse createMultipartUploadResponse = s3Client.createMultipartUpload(createMultipartUploadRequest);
    String uploadId = createMultipartUploadResponse.uploadId();
    log.info("UploadId: {}", uploadId);

    try {
      InputStream inputStream = multipartFile.getInputStream();
      int BUFFER_SIZE = 5 * 1024 * 1024, partId = 1, bytesRead;
      byte[] byteArray = new byte[BUFFER_SIZE];
      List<CompletedPart> completedParts = new ArrayList<>();

      while ((bytesRead = inputStream.read(byteArray, 0, BUFFER_SIZE)) != -1) {
        log.info("Part No. {}, Bytes Read: {}", partId, bytesRead);

        UploadPartRequest uploadRequest = UploadPartRequest.builder()
            .bucket(bucketName)
            .key(key)
            .uploadId(uploadId)
            .partNumber(partId)
            .build();

        UploadPartResponse uploadPartResponse = s3Client.uploadPart(uploadRequest,
            RequestBody.fromByteBuffer(ByteBuffer.wrap(byteArray, 0, bytesRead)));

        completedParts.add(CompletedPart.builder()
            .partNumber(partId)
            .eTag(uploadPartResponse.eTag())
            .build());

        log.info("Successfully submitted uploadPartId: {} | {}", partId++, uploadPartResponse);
      }

      CompletedMultipartUpload completedMultipartUpload = CompletedMultipartUpload.builder()
          .parts(completedParts)
          .build();

      CompleteMultipartUploadRequest completeMultipartUploadRequest = CompleteMultipartUploadRequest.builder()
          .bucket(bucketName)
          .key(key)
          .uploadId(uploadId)
          .multipartUpload(completedMultipartUpload)
          .build();

      String response = s3Client.completeMultipartUpload(completeMultipartUploadRequest).key();
      log.info("File uploaded successfully.");
      return response;
    } catch (IOException e) {
      // abort upload
      AbortMultipartUploadRequest abortMultipartUploadRequest = AbortMultipartUploadRequest.builder()
          .bucket(bucketName)
          .key(key)
          .uploadId(uploadId)
          .build();
      s3Client.abortMultipartUpload(abortMultipartUploadRequest);
      return e.getMessage();
    }
  }

  @Override
  public String downloadFile(String fileName) {
    GetObjectRequest getObjectRequest = GetObjectRequest.builder()
        .bucket(awsProperties.getS3().getBucket())
        .key(fileName)
        .build();

    try {
      byte[] objectResponse = s3Client.getObject(getObjectRequest).readAllBytes();
      File file = new File(System.getProperty("user.dir") + "/" + fileName);
      FileOutputStream fileOutputStream = new FileOutputStream(file, false);
      fileOutputStream.write(objectResponse);
      fileOutputStream.close();
      return file.getAbsolutePath();
    } catch (IOException e) {
      throw new RuntimeException(e);
    }
  }
}