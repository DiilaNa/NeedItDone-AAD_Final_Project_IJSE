FROM maven:3.9.3-eclipse-temurin-17 AS build

WORKDIR /app

# Copy backend module
COPY BackEnd/ .

# Build the JAR
RUN mvn clean package -DskipTests

# Use a lightweight JDK for running
FROM openjdk:17-jdk-slim
WORKDIR /app

# Copy the built JAR
COPY --from=build /target/BackEnd-0.0.1-SNAPSHOT.jar app.jar
COPY --from=build /app/target/BackEnd-0.0.1-SNAPSHOT.jar app.jar


EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
