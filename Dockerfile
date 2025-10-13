# Use official Java 17 image
FROM openjdk:17-jdk-slim

# Set the working directory
WORKDIR /app

# Copy the backend jar into the container
ARG JAR_FILE=backend/target/*.jar
COPY ${JAR_FILE} app.jar

# Expose the default Spring Boot port
EXPOSE 8080

# Run the jar file
ENTRYPOINT ["java", "-jar", "app.jar"]
