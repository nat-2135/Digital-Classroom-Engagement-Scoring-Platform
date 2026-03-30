FROM eclipse-temurin:17-jdk

WORKDIR /app

# Copy only pom.xml first (better caching)
COPY pom.xml .

# Install Maven and download dependencies
RUN apt-get update && apt-get install -y maven && mvn dependency:go-offline

# Copy remaining project files
COPY . .

# Build the application
RUN mvn clean package -DskipTests

# Run the application
CMD ["java", "-jar", "target/*.jar"]