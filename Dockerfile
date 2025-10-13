# Use Java 17 image
FROM openjdk:17-jdk-slim AS build

# Set working directory
WORKDIR /app

# Copy Maven files
COPY backend/pom.xml backend/pom.xml
COPY backend/src backend/src

# Install Maven and build the JAR
RUN apt-get update && apt-get install -y maven
RUN mvn -f backend/pom.xml clean package -DskipTests

# Second stage: runtime
FROM openjdk:17-jdk-slim
WORKDIR /app

# Copy the JAR from build stage
COPY --from=build /app/target/*.jar app.jar

# Expose port
EXPOSE 8080

# Run the app
ENTRYPOINT ["java","-jar","app.jar"]

