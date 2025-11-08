export enum CardType {
  OVERVIEW = 'overview',
  ARCHITECTURE = 'architecture',
  SEQUENCE = 'sequence',
  DEPLOYMENT = 'deployment',
  DATAFLOW = 'dataflow',
  CUSTOM = 'custom'
}

export const CARD_TYPE_LABELS: Record<CardType, string> = {
  [CardType.OVERVIEW]: 'Overview',
  [CardType.ARCHITECTURE]: 'Architecture',
  [CardType.SEQUENCE]: 'Sequence Diagram',
  [CardType.DEPLOYMENT]: 'Deployment',
  [CardType.DATAFLOW]: 'Data Flow',
  [CardType.CUSTOM]: 'Custom'
};

export const CARD_TYPE_ICONS: Record<CardType, string> = {
  [CardType.OVERVIEW]: 'description',
  [CardType.ARCHITECTURE]: 'account_tree',
  [CardType.SEQUENCE]: 'timeline',
  [CardType.DEPLOYMENT]: 'cloud_upload',
  [CardType.DATAFLOW]: 'device_hub',
  [CardType.CUSTOM]: 'note_add'
};

export const CARD_TYPE_COLORS: Record<CardType, string> = {
  [CardType.OVERVIEW]: 'primary',
  [CardType.ARCHITECTURE]: 'accent',
  [CardType.SEQUENCE]: 'warn',
  [CardType.DEPLOYMENT]: 'primary',
  [CardType.DATAFLOW]: 'accent',
  [CardType.CUSTOM]: 'basic'
};

export const CARD_TYPES = Object.values(CardType);

export interface CardTemplate {
  title: string;
  cardType: CardType;
  description: string;
  content: string;
  mermaidDiagram?: string;
}

export const CARD_TEMPLATES: CardTemplate[] = [
  {
    title: 'Application Overview',
    cardType: CardType.OVERVIEW,
    description: 'High-level overview of the application',
    content: `# Application Overview

## Purpose
[Describe the main purpose and business value of this application]

## Key Features
- Feature 1
- Feature 2
- Feature 3

## Users
[Describe the primary users and stakeholders]

## Business Context
[Explain how this application fits into the broader business landscape]
`,
    mermaidDiagram: `graph TD
    A[Users] -->|Access| B[Application]
    B -->|Uses| C[Database]
    B -->|Integrates| D[External Services]`
  },
  {
    title: 'System Architecture',
    cardType: CardType.ARCHITECTURE,
    description: 'Technical architecture and component breakdown',
    content: `# System Architecture

## Components
### Frontend
[Describe frontend technologies and structure]

### Backend
[Describe backend services and APIs]

### Database
[Describe data storage solution]

## Integration Points
[List external systems and integration methods]
`,
    mermaidDiagram: `graph TB
    subgraph Frontend
        A[Web UI]
        B[Mobile App]
    end
    subgraph Backend
        C[API Gateway]
        D[Service Layer]
        E[Data Layer]
    end
    subgraph Storage
        F[(Database)]
        G[(Cache)]
    end
    A --> C
    B --> C
    C --> D
    D --> E
    E --> F
    E --> G`
  },
  {
    title: 'Sequence Diagram',
    cardType: CardType.SEQUENCE,
    description: 'Process flow and interactions',
    content: `# Sequence Diagram

## Process: [Name of Process]

### Actors
- **User**: [Description]
- **System**: [Description]
- **External Service**: [Description]

### Steps
1. [Step 1 description]
2. [Step 2 description]
3. [Step 3 description]

### Error Handling
[Describe error scenarios and handling]
`,
    mermaidDiagram: `sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant Database

    User->>Frontend: Request Action
    Frontend->>Backend: API Call
    Backend->>Database: Query Data
    Database-->>Backend: Return Data
    Backend-->>Frontend: Response
    Frontend-->>User: Display Result`
  },
  {
    title: 'Deployment Architecture',
    cardType: CardType.DEPLOYMENT,
    description: 'Infrastructure and deployment configuration',
    content: `# Deployment Architecture

## Environments
### Development
[Describe dev environment setup]

### Staging
[Describe staging environment]

### Production
[Describe production environment]

## Infrastructure
[Detail servers, containers, cloud services]

## CI/CD Pipeline
[Describe build and deployment process]
`,
    mermaidDiagram: `graph LR
    subgraph Production
        A[Load Balancer]
        B[App Server 1]
        C[App Server 2]
        D[(Primary DB)]
        E[(Replica DB)]
    end
    subgraph External
        F[CDN]
        G[Monitoring]
    end
    A --> B
    A --> C
    B --> D
    C --> D
    D --> E
    F --> A
    B --> G
    C --> G`
  },
  {
    title: 'Data Flow',
    cardType: CardType.DATAFLOW,
    description: 'Data movement and transformations',
    content: `# Data Flow

## Data Sources
[List all data sources]

## Data Transformations
[Describe how data is processed and transformed]

## Data Consumers
[List systems/services that consume the data]

## Data Governance
[Security, privacy, retention policies]
`,
    mermaidDiagram: `graph LR
    A[Data Source] -->|Extract| B[ETL Process]
    B -->|Transform| C[Data Warehouse]
    C -->|Load| D[Analytics]
    C -->|Load| E[Reporting]
    F[Real-time Events] -->|Stream| G[Event Processor]
    G --> H[Data Lake]`
  }
];

export const KEYBOARD_SHORTCUTS = {
  SAVE: 'Ctrl+S',
  CANCEL: 'Escape',
  NEW_CARD: 'Ctrl+N',
  SEARCH: 'Ctrl+F'
} as const;

export const DRAFT_KEY_PREFIX = 'card-draft-';

export const DEFAULT_CARD_VALUES = {
  sortOrder: 0,
  visible: true
} as const;
