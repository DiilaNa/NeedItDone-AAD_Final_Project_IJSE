# Stage 1: Build the backend JAR
FROM maven:3.9.3-eclipse-temurin-17 AS build

WORKDIR /app

# Copy backend module
COPY Backend/pom.xml .
COPY Backend/src ./src

# Build the JAR
RUN mvn clean package -DskipTests

# Stage 2: Run the app
FROM openjdk:17-jdk-slim

WORKDIR /app

# Copy the built JAR
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]

