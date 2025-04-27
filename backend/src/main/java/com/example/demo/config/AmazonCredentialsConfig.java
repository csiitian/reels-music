package com.example.demo.config;

import com.example.demo.properties.AwsProperties;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsBasicCredentials;
import software.amazon.awssdk.auth.credentials.AwsCredentialsProvider;
import software.amazon.awssdk.auth.credentials.StaticCredentialsProvider;

@Configuration
@RequiredArgsConstructor
public class AmazonCredentialsConfig {

  private final AwsProperties awsProperties;

  @Bean("awsCredentials")
  public AwsCredentialsProvider awsCredentials() {
    AwsBasicCredentials awsBasicCredentials = AwsBasicCredentials.create(
        awsProperties.getAccess(),
        awsProperties.getSecret()
    );
    return StaticCredentialsProvider.create(awsBasicCredentials);
  }
}