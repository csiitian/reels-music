# Use the official OpenJDK 23 image from Docker Hub
FROM openjdk:23-jdk-slim

# Set the working directory inside the container
WORKDIR /app

# Copy the Spring Boot JAR file into the container at /app
COPY target/demo-0.0.1-SNAPSHOT.jar app.jar

# Expose the port the app will run on (default Spring Boot port is 8080)
EXPOSE 8080

# Run the Spring Boot application
ENTRYPOINT ["java", "-jar", "/app/app.jar"]
