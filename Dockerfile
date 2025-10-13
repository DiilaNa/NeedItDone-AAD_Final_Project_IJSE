# Stage 1: Build
FROM openjdk:17-jdk-slim AS build
WORKDIR /app

# Copy Maven files (use exact folder name)
COPY BackEnd/pom.xml BackEnd/pom.xml
COPY BackEnd/src BackEnd/src

# Install Maven and build the JAR
RUN apt-get update && apt-get install -y maven
RUN mvn -f BackEnd/pom.xml clean package -DskipTests

# Stage 2: Runtime
FROM openjdk:17-jdk-slim
WORKDIR /app

# Copy the built JAR
COPY --from=build /app/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]
