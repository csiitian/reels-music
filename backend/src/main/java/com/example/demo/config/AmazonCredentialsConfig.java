package com.example.demo.config;

import com.example.demo.properties.AwsProperties;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import software.amazon.awssdk.auth.credentials.AwsCredentialsProvider;
import software.amazon.awssdk.auth.credentials.DefaultCredentialsProvider;

@Configuration
@RequiredArgsConstructor
public class AmazonCredentialsConfig {

  private final AwsProperties awsProperties;

  @Bean("awsCredentials")
  public AwsCredentialsProvider awsCredentials() {
    return DefaultCredentialsProvider.create();
  }
}