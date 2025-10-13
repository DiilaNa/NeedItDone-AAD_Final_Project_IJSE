# Stage 1: Build
FROM openjdk:17-jdk-slim AS build
WORKDIR /app

# Copy Maven files
COPY Backend/pom.xml Backend/pom.xml
COPY Backend/src Backend/src

# Install Maven & build
RUN apt-get update && apt-get install -y maven
RUN mvn -f Backend/pom.xml clean package -DskipTests

# Stage 2: Runtime
FROM openjdk:17-jdk-slim
WORKDIR /app

COPY --from=build /app/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","app.jar"]


