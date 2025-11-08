# Structurizr Architecture Scanner

A comprehensive system for scanning, tracking, and visualizing your architecture landscape across multiple applications.

## Overview

This project provides a complete solution for:
- Scanning GitLab repositories to extract architecture information
- Storing application metadata, technology stacks, interfaces, and dependencies in a versioned database
- Identifying and managing shared components (e.g., KeyCloak for SSO)
- Tracking application evolution over time
- Browsing and analyzing your architecture landscape through a web UI
- Generating Structurizr DSL for visualization

## Architecture

The system consists of three main components:

1. **Backend (Spring Boot)**: REST API and database layer
2. **Frontend (Angular)**: Web UI for browsing and analyzing applications
3. **Database (PostgreSQL)**: Stores all architecture data with versioning

## Technology Stack

### Backend
- Java 21
- Spring Boot 3.2.1
- Spring Data JPA
- PostgreSQL 15
- Maven
- GitLab4J API

### Frontend
- Angular 17
- Angular Material
- TypeScript
- RxJS

### Infrastructure
- Docker & Docker Compose
- PostgreSQL 15

## Prerequisites

- Docker and Docker Compose
- (Optional) Java 21 and Maven for local development
- (Optional) Node.js 20+ and npm for frontend development
- GitLab access token for repository scanning

## Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd structurizr-db
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# GitLab Configuration
GITLAB_URL=https://your-gitlab-instance.com
GITLAB_TOKEN=your-gitlab-access-token

# Database Configuration (optional, defaults are fine for local dev)
DB_HOST=postgres
DB_PORT=5432
DB_NAME=architecturedb
DB_USER=postgres
DB_PASSWORD=postgres

# Backend Configuration
SERVER_PORT=8080
```

### 3. Start the Application

```bash
docker-compose up -d
```

This will start:
- PostgreSQL database on port 5432
- Spring Boot backend on port 8080
- Angular frontend on port 4200

### 4. Access the Application

- **Frontend UI**: http://localhost:4200
- **Backend API**: http://localhost:8080/api
- **API Health Check**: http://localhost:8080/actuator/health

## Database Schema

### Core Entities

#### Application
Represents an application in the architecture landscape.

- **UUID**: Unique identifier for cross-referencing
- **Name**: Application name
- **Description**: Application description
- **Repository URL**: GitLab repository URL
- **Department**: Responsible team/department
- **Author**: Repository creator
- **Is Shared Component**: Flag for reusable building blocks
- **Current Version**: Latest scan version number
- **Last Scanned At**: Timestamp of last scan

#### ApplicationVersion
Tracks version history for applications.

- **Version Number**: Incremental version
- **Scanned Branch**: Git branch that was scanned
- **Commit Hash**: Git commit at scan time
- **Technology Stack Snapshot**: JSON snapshot
- **Interfaces Snapshot**: JSON snapshot
- **Scan Notes**: Additional information

#### TechnologyStack
Technologies used by applications.

- **Name**: Technology name (e.g., "Spring Boot")
- **Version**: Technology version
- **Category**: Framework, Database, MessageQueue, etc.
- **Detection Source**: Where it was detected (e.g., "pom.xml")

#### ApplicationInterface
Connections between applications.

- **UUID**: Unique identifier
- **Source Application**: Calling application
- **Target Application**: Receiving application
- **Protocol**: REST, gRPC, AMQP, etc.
- **Destination**: Hostname, URL, or queue name
- **Port**: Port number (if applicable)
- **Direction**: OUTBOUND, INBOUND, or BIDIRECTIONAL

#### ApplicationUser
Users of applications.

- **User Name**: User or group name
- **User Type**: INDIVIDUAL, GROUP, DEPARTMENT, EXTERNAL
- **Role**: Permission level

#### ApplicationMetadata
Flexible key-value metadata.

- **Key**: Metadata key
- **Value**: Metadata value
- **Value Type**: STRING, NUMBER, BOOLEAN, JSON
- **Category**: Grouping category

## REST API Endpoints

### Applications

```
GET    /api/applications                    # Get all applications
GET    /api/applications/{id}               # Get application by ID
GET    /api/applications/uuid/{uuid}        # Get application by UUID
GET    /api/applications/search?term={term} # Search applications
GET    /api/applications/department/{dept}  # Get by department
GET    /api/applications/departments        # Get all departments
GET    /api/applications/shared-components  # Get shared components
GET    /api/applications/statistics         # Get statistics
POST   /api/applications                    # Create application
PUT    /api/applications/{id}               # Update application
DELETE /api/applications/{id}               # Delete application
```

### Technology Stack

```
GET /api/technology-stack/application/{id}           # Get by application ID
GET /api/technology-stack/application/uuid/{uuid}    # Get by application UUID
GET /api/technology-stack/technologies               # Get all technologies
GET /api/technology-stack/categories                 # Get all categories
GET /api/technology-stack/search?name={name}&version={version} # Search
```

### Interfaces

```
GET /api/interfaces/application/{id}    # Get all interfaces for application
GET /api/interfaces/source/{id}         # Get outbound interfaces
GET /api/interfaces/target/{id}         # Get inbound interfaces
GET /api/interfaces/protocols           # Get all protocols
GET /api/interfaces/protocol/{protocol} # Get by protocol
GET /api/interfaces/uuid/{uuid}         # Get by UUID
```

### Versions

```
GET /api/versions/application/{id}         # Get versions by application ID
GET /api/versions/application/uuid/{uuid}  # Get versions by UUID
GET /api/versions/{id}                     # Get version by ID
```

## Development

### Backend Development

#### Prerequisites
- Java 21
- Maven 3.9+
- PostgreSQL 15

#### Running Locally

```bash
# Start PostgreSQL
docker run -d -p 5432:5432 \
  -e POSTGRES_DB=architecturedb \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  postgres:15-alpine

# Run Spring Boot application
cd structurizr-db
mvn spring-boot:run
```

#### Building

```bash
mvn clean package
```

### Frontend Development

#### Prerequisites
- Node.js 20+
- npm

#### Running Locally

```bash
cd frontend
npm install
npm start
```

The application will be available at http://localhost:4200

#### Building

```bash
npm run build
```

## Usage Guide

### Dashboard
View high-level statistics about your architecture landscape:
- Total number of applications
- Number of shared components
- Number of departments

### Applications
Browse all applications in your landscape:
- Search by name or description
- Filter by department
- View application details including technology stack, interfaces, and version history

### Shared Components
View reusable building blocks used across multiple applications:
- KeyCloak for SSO
- Shared databases
- Shared message queues
- Other shared services

### Technology Overview
Analyze technology usage across your landscape:
- See which applications use specific technologies
- Track technology versions
- Identify outdated dependencies

## Data Model Philosophy

### UUID-based Identification
Applications and interfaces use UUIDs to:
- Ensure uniqueness across the landscape
- Enable proper identification of shared components
- Allow cross-referencing between different scans

### Versioning Strategy
- Each successful scan increments the version number
- Historical snapshots are stored in `ApplicationVersion`
- Enables tracking of application evolution over time
- Supports queries like "what changed between version X and Y?"

### Flexible Metadata
The `ApplicationMetadata` table allows storing arbitrary key-value pairs:
- Extensible without schema changes
- Supports custom attributes per organization
- Enables future analytics capabilities

## Next Steps

### GitLab Scanner Component
The next phase will implement the actual repository scanner:
- Connect to GitLab API
- Scan repositories (development or main branch)
- Extract technology information from build files
- Detect interfaces from configuration files
- Populate the database

### Structurizr DSL Generation
Generate Structurizr workspace from the aggregated data:
- Create workspace with all applications
- Define relationships based on interfaces
- Group by departments
- Highlight shared components

### Notion Integration
Create Notion overview cards:
- One card per application
- Sync description and metadata
- Enable documentation workflow

## Contributing

### Code Structure

```
structurizr-db/
├── src/main/java/com/structurizr/scanner/
│   ├── entity/              # JPA entities
│   ├── repository/          # Spring Data repositories
│   ├── dto/                 # Data Transfer Objects
│   ├── controller/          # REST controllers
│   ├── mapper/              # Entity-DTO mappers
│   └── service/             # Business logic (future)
├── src/main/resources/
│   └── application.yml      # Configuration
├── frontend/
│   └── src/app/
│       ├── components/      # Angular components
│       ├── services/        # API services
│       ├── models/          # TypeScript interfaces
│       └── environments/    # Environment configs
├── docker-compose.yml       # Docker orchestration
└── Dockerfile              # Backend container

```

## License

[Your License Here]

## Support

For issues, questions, or contributions, please contact [your-contact-info].
