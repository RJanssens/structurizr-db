import { Component, Input, OnInit, OnChanges, SimpleChanges, AfterViewInit, HostListener, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { ApplicationCardService } from '../../services/application-card.service';
import { ApplicationCard } from '../../models/application.model';
import { marked } from 'marked';
import mermaid from 'mermaid';

// Card Templates
interface CardTemplate {
  title: string;
  cardType: string;
  content: string;
  mermaidDiagram?: string;
  description: string;
}

const CARD_TEMPLATES: CardTemplate[] = [
  {
    title: 'Application Overview',
    cardType: 'overview',
    description: 'High-level overview of the application',
    content: `# Application Overview

## Purpose
[Describe the main purpose and business value]

## Key Features
- Feature 1
- Feature 2
- Feature 3

## Target Users
[Who uses this application?]

## Dependencies
[List key dependencies]`,
    mermaidDiagram: `graph TD
    A[Users] -->|Access| B[Application]
    B -->|Reads/Writes| C[Database]
    B -->|Calls| D[External API]`
  },
  {
    title: 'Architecture Diagram',
    cardType: 'architecture',
    description: 'Component architecture and relationships',
    content: `# Architecture

## Components
- **Frontend**: [Technology stack]
- **Backend**: [Technology stack]
- **Database**: [Database type]

## Design Patterns
[List architectural patterns used]`,
    mermaidDiagram: `graph LR
    subgraph Frontend
        A[UI Layer]
        B[State Management]
    end
    subgraph Backend
        C[API Layer]
        D[Business Logic]
        E[Data Access]
    end
    subgraph Data
        F[(Database)]
    end
    A --> C
    B --> C
    C --> D
    D --> E
    E --> F`
  },
  {
    title: 'Sequence Diagram',
    cardType: 'sequence',
    description: 'Process flow and interactions',
    content: `# Process Flow

## Scenario
[Describe the scenario]

## Steps
1. [Step 1]
2. [Step 2]
3. [Step 3]

## Error Handling
[How errors are handled]`,
    mermaidDiagram: `sequenceDiagram
    participant User
    participant Frontend
    participant Backend
    participant Database

    User->>+Frontend: Action
    Frontend->>+Backend: API Request
    Backend->>+Database: Query
    Database-->>-Backend: Result
    Backend-->>-Frontend: Response
    Frontend-->>-User: Display Result`
  },
  {
    title: 'Deployment Architecture',
    cardType: 'deployment',
    description: 'Infrastructure and deployment setup',
    content: `# Deployment

## Environments
- **Development**: [Details]
- **Staging**: [Details]
- **Production**: [Details]

## Infrastructure
[Describe infrastructure]

## CI/CD Pipeline
[Describe deployment process]`,
    mermaidDiagram: `graph TB
    subgraph Production
        A[Load Balancer]
        B[App Server 1]
        C[App Server 2]
        D[(Primary DB)]
        E[(Replica DB)]
    end
    A --> B
    A --> C
    B --> D
    C --> D
    D --> E`
  },
  {
    title: 'Data Flow Diagram',
    cardType: 'dataflow',
    description: 'How data flows through the system',
    content: `# Data Flow

## Data Sources
- [Source 1]
- [Source 2]

## Processing Steps
1. [Step 1]
2. [Step 2]

## Data Consumers
- [Consumer 1]
- [Consumer 2]`,
    mermaidDiagram: `graph LR
    A[Data Source] -->|Raw Data| B[Ingestion]
    B -->|Validated| C[Processing]
    C -->|Transformed| D[Storage]
    D -->|Queries| E[API]
    E -->|Formatted| F[Consumers]`
  }
];

@Component({
  selector: 'app-application-cards',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatDialogModule,
    MatSnackBarModule,
    MatProgressSpinnerModule,
    MatCheckboxModule,
    MatMenuModule,
    MatBadgeModule
  ],
  template: `
    <div class="cards-container">
      <div class="cards-header">
        <h2>Documentation Cards
          <mat-icon [matBadge]="cards.length" matBadgeColor="primary" class="badge-icon">description</mat-icon>
        </h2>
        <div class="header-actions">
          <mat-form-field appearance="outline" class="search-field" *ngIf="!editMode">
            <mat-label>Search cards</mat-label>
            <input matInput [(ngModel)]="searchTerm" (ngModelChange)="onSearchChange()" placeholder="Search...">
            <mat-icon matSuffix>search</mat-icon>
          </mat-form-field>

          <mat-form-field appearance="outline" class="filter-field" *ngIf="!editMode && cards.length > 0">
            <mat-label>Filter by type</mat-label>
            <mat-select [(ngModel)]="selectedCardType" (selectionChange)="onFilterChange()">
              <mat-option value="all">All Types</mat-option>
              <mat-option value="overview">Overview</mat-option>
              <mat-option value="architecture">Architecture</mat-option>
              <mat-option value="sequence">Sequence</mat-option>
              <mat-option value="deployment">Deployment</mat-option>
              <mat-option value="dataflow">Data Flow</mat-option>
              <mat-option value="custom">Custom</mat-option>
            </mat-select>
          </mat-form-field>

          <button mat-raised-button color="primary" [matMenuTriggerFor]="menu" *ngIf="!editMode">
            <mat-icon>add</mat-icon>
            New Card
          </button>
          <mat-menu #menu="matMenu">
            <button mat-menu-item (click)="createNewCard()">
              <mat-icon>note_add</mat-icon>
              <span>Blank Card</span>
            </button>
            <button mat-menu-item [matMenuTriggerFor]="templatesMenu">
              <mat-icon>content_copy</mat-icon>
              <span>From Template</span>
            </button>
          </mat-menu>
          <mat-menu #templatesMenu="matMenu">
            <button mat-menu-item *ngFor="let template of templates" (click)="createFromTemplate(template)">
              <mat-icon>{{ getCardTypeIcon(template.cardType) }}</mat-icon>
              <div class="template-menu-item">
                <div>{{ template.title }}</div>
                <small>{{ template.description }}</small>
              </div>
            </button>
          </mat-menu>

          <button mat-icon-button [matMenuTriggerFor]="bulkMenu" *ngIf="!editMode && filteredCards.length > 0">
            <mat-icon>more_vert</mat-icon>
          </button>
          <mat-menu #bulkMenu="matMenu">
            <button mat-menu-item (click)="toggleBulkSelect()">
              <mat-icon>{{ bulkSelectMode ? 'check_box' : 'check_box_outline_blank' }}</mat-icon>
              <span>{{ bulkSelectMode ? 'Cancel Selection' : 'Select Multiple' }}</span>
            </button>
            <button mat-menu-item (click)="exportAllCards()" [disabled]="filteredCards.length === 0">
              <mat-icon>download</mat-icon>
              <span>Export All to Markdown</span>
            </button>
          </mat-menu>
        </div>
      </div>

      <div *ngIf="bulkSelectMode && selectedCards.size > 0" class="bulk-actions">
        <span>{{ selectedCards.size }} card(s) selected</span>
        <button mat-raised-button (click)="bulkDelete()">
          <mat-icon>delete</mat-icon>
          Delete Selected
        </button>
        <button mat-raised-button (click)="bulkToggleVisibility(true)">
          <mat-icon>visibility</mat-icon>
          Show Selected
        </button>
        <button mat-raised-button (click)="bulkToggleVisibility(false)">
          <mat-icon>visibility_off</mat-icon>
          Hide Selected
        </button>
      </div>

      <div *ngIf="loading" class="loading-spinner">
        <mat-spinner></mat-spinner>
      </div>

      <div *ngIf="!loading && !editMode && filteredCards.length === 0 && cards.length === 0" class="empty-state">
        <mat-icon>description</mat-icon>
        <p>No cards yet. Create your first documentation card!</p>
      </div>

      <div *ngIf="!loading && !editMode && filteredCards.length === 0 && cards.length > 0" class="empty-state">
        <mat-icon>search_off</mat-icon>
        <p>No cards match your search/filter criteria</p>
      </div>

      <div *ngIf="!loading && !editMode && filteredCards.length > 0" class="cards-grid">
        <mat-card *ngFor="let card of filteredCards" class="card-item" [class.selected]="bulkSelectMode && selectedCards.has(card.id!)">
          <mat-checkbox *ngIf="bulkSelectMode" class="bulk-checkbox"
                        [checked]="selectedCards.has(card.id!)"
                        (change)="toggleCardSelection(card.id!)">
          </mat-checkbox>

          <mat-card-header>
            <mat-card-title>{{ card.title }}</mat-card-title>
            <mat-card-subtitle>
              <mat-chip>
                <mat-icon class="chip-icon">{{ getCardTypeIcon(card.cardType) }}</mat-icon>
                {{ card.cardType }}
              </mat-chip>
              <small class="updated-time">Updated {{ getRelativeTime(card.updatedAt) }}</small>
            </mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div *ngIf="card.content" class="card-content" [innerHTML]="renderMarkdown(card.content)"></div>
            <div *ngIf="card.mermaidDiagram" class="mermaid-container">
              <div class="mermaid" [attr.data-diagram]="card.mermaidDiagram">{{ card.mermaidDiagram }}</div>
            </div>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button (click)="editCard(card)">
              <mat-icon>edit</mat-icon>
              Edit
            </button>
            <button mat-button (click)="cloneCard(card)">
              <mat-icon>content_copy</mat-icon>
              Clone
            </button>
            <button mat-button (click)="exportCard(card)">
              <mat-icon>download</mat-icon>
              Export
            </button>
            <button mat-button color="warn" (click)="deleteCardWithConfirmation(card)">
              <mat-icon>delete</mat-icon>
              Delete
            </button>
          </mat-card-actions>
        </mat-card>
      </div>

      <mat-card *ngIf="editMode" class="editor-card">
        <mat-card-header>
          <mat-card-title>{{ currentCard.id ? 'Edit Card' : 'New Card' }}</mat-card-title>
          <span class="auto-save-indicator" *ngIf="hasUnsavedChanges">
            <mat-icon>save</mat-icon>
            Draft saved
          </span>
        </mat-card-header>
        <mat-card-content>
          <div class="form-grid">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Title</mat-label>
              <input matInput [(ngModel)]="currentCard.title" (ngModelChange)="onCardChange()" placeholder="Card title" required>
              <mat-error>Title is required</mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Card Type</mat-label>
              <mat-select [(ngModel)]="currentCard.cardType" (selectionChange)="onCardChange()" required>
                <mat-option value="overview">
                  <mat-icon>dashboard</mat-icon>
                  Overview
                </mat-option>
                <mat-option value="architecture">
                  <mat-icon>account_tree</mat-icon>
                  Architecture
                </mat-option>
                <mat-option value="sequence">
                  <mat-icon>timeline</mat-icon>
                  Sequence Diagram
                </mat-option>
                <mat-option value="deployment">
                  <mat-icon>cloud_upload</mat-icon>
                  Deployment
                </mat-option>
                <mat-option value="dataflow">
                  <mat-icon>device_hub</mat-icon>
                  Data Flow
                </mat-option>
                <mat-option value="custom">
                  <mat-icon>note</mat-icon>
                  Custom
                </mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Content (Markdown supported)</mat-label>
              <textarea matInput [(ngModel)]="currentCard.content" (ngModelChange)="onCardChange()"
                        rows="10"
                        placeholder="Write your content here. Markdown is supported."></textarea>
              <mat-hint>Use Markdown syntax for formatting. Press Ctrl+S to save, Esc to cancel.</mat-hint>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Mermaid Diagram</mat-label>
              <textarea matInput [(ngModel)]="currentCard.mermaidDiagram" (ngModelChange)="onCardChange()"
                        rows="10"
                        placeholder="graph TD&#10;  A[Start] --> B[Process]&#10;  B --> C[End]"></textarea>
              <mat-hint>Use Mermaid syntax for diagrams</mat-hint>
            </mat-form-field>

            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Sort Order</mat-label>
                <input matInput type="number" [(ngModel)]="currentCard.sortOrder" (ngModelChange)="onCardChange()" placeholder="0">
              </mat-form-field>

              <mat-checkbox [(ngModel)]="currentCard.visible" (ngModelChange)="onCardChange()">
                Visible
              </mat-checkbox>
            </div>
          </div>

          <div class="preview-section" *ngIf="currentCard.content || currentCard.mermaidDiagram">
            <h3>Preview</h3>
            <div *ngIf="currentCard.content" class="preview-content" [innerHTML]="renderMarkdown(currentCard.content)"></div>
            <div *ngIf="currentCard.mermaidDiagram" class="mermaid-preview">
              <div class="mermaid">{{ currentCard.mermaidDiagram }}</div>
            </div>
          </div>
        </mat-card-content>
        <mat-card-actions>
          <button mat-raised-button color="primary" (click)="saveCard()" [disabled]="isSaving">
            <mat-spinner *ngIf="isSaving" diameter="20"></mat-spinner>
            <mat-icon *ngIf="!isSaving">save</mat-icon>
            {{ isSaving ? 'Saving...' : 'Save' }}
          </button>
          <button mat-button (click)="cancelEditWithConfirmation()">
            Cancel
          </button>
        </mat-card-actions>
      </mat-card>
    </div>
  `,
  styles: [`
    .cards-container {
      padding: 20px;
    }

    .cards-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      flex-wrap: wrap;
      gap: 10px;
    }

    .cards-header h2 {
      margin: 0;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .badge-icon {
      font-size: 28px;
      width: 28px;
      height: 28px;
    }

    .header-actions {
      display: flex;
      gap: 10px;
      align-items: center;
      flex-wrap: wrap;
    }

    .search-field, .filter-field {
      min-width: 200px;
    }

    .bulk-actions {
      background: #e3f2fd;
      padding: 15px;
      margin-bottom: 20px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      gap: 15px;
    }

    .bulk-actions span {
      flex: 1;
      font-weight: 500;
    }

    .loading-spinner {
      display: flex;
      justify-content: center;
      padding: 40px;
    }

    .empty-state {
      text-align: center;
      padding: 60px 20px;
      color: #666;
    }

    .empty-state mat-icon {
      font-size: 64px;
      width: 64px;
      height: 64px;
      color: #ccc;
    }

    .cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
      gap: 20px;
    }

    .card-item {
      height: 100%;
      position: relative;
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .card-item:hover {
      transform: translateY(-4px);
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    }

    .card-item.selected {
      border: 2px solid #3f51b5;
    }

    .bulk-checkbox {
      position: absolute;
      top: 10px;
      left: 10px;
      z-index: 10;
    }

    .card-content {
      margin-bottom: 15px;
      line-height: 1.6;
      max-height: 300px;
      overflow-y: auto;
    }

    .mermaid-container {
      margin-top: 15px;
      padding: 10px;
      background: #f5f5f5;
      border-radius: 4px;
      overflow-x: auto;
    }

    .chip-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      margin-right: 4px;
    }

    .updated-time {
      margin-left: 10px;
      color: #666;
    }

    .editor-card {
      margin-top: 20px;
    }

    .auto-save-indicator {
      display: flex;
      align-items: center;
      gap: 5px;
      color: #4caf50;
      font-size: 14px;
    }

    .form-grid {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }

    .form-row {
      display: flex;
      gap: 15px;
      align-items: center;
    }

    .full-width {
      width: 100%;
    }

    .preview-section {
      margin-top: 30px;
      padding: 20px;
      background: #f9f9f9;
      border-radius: 4px;
    }

    .preview-content {
      margin-bottom: 20px;
    }

    .mermaid-preview {
      background: white;
      padding: 15px;
      border-radius: 4px;
      overflow-x: auto;
    }

    mat-card-actions {
      padding: 16px;
      display: flex;
      gap: 10px;
    }

    .template-menu-item {
      display: flex;
      flex-direction: column;
    }

    .template-menu-item small {
      color: #666;
      font-size: 11px;
    }
  `]
})
export class ApplicationCardsComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() applicationId!: number;
  @Output() cardCountChange = new EventEmitter<number>();

  cards: ApplicationCard[] = [];
  filteredCards: ApplicationCard[] = [];
  editMode = false;
  currentCard: ApplicationCard = this.getEmptyCard();
  templates = CARD_TEMPLATES;
  loading = false;
  isSaving = false;
  hasUnsavedChanges = false;

  searchTerm = '';
  selectedCardType = 'all';

  bulkSelectMode = false;
  selectedCards = new Set<number>();

  private readonly DRAFT_KEY_PREFIX = 'card-draft-';

  constructor(
    private cardService: ApplicationCardService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    mermaid.initialize({
      startOnLoad: true,
      theme: 'default',
      securityLevel: 'loose'
    });
  }

  ngOnInit(): void {
    if (this.applicationId) {
      this.loadCards();
      this.loadDraft();
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.initMermaid(), 100);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['applicationId'] && !changes['applicationId'].firstChange) {
      this.loadCards();
    }
  }

  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (this.editMode) {
      if (event.ctrlKey && event.key === 's') {
        event.preventDefault();
        this.saveCard();
      } else if (event.key === 'Escape') {
        event.preventDefault();
        this.cancelEditWithConfirmation();
      }
    }
  }

  loadCards(): void {
    this.loading = true;
    this.cardService.getCards(this.applicationId, true).subscribe({
      next: (cards) => {
        this.cards = cards;
        this.applyFilters();
        this.cardCountChange.emit(cards.length);
        this.loading = false;
        setTimeout(() => this.initMermaid(), 100);
      },
      error: (error) => {
        console.error('Error loading cards:', error);
        this.snackBar.open('Error loading cards. Please try again.', 'Close', { duration: 5000 });
        this.loading = false;
      }
    });
  }

  onSearchChange(): void {
    this.applyFilters();
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    this.filteredCards = this.cards.filter(card => {
      const matchesSearch = !this.searchTerm ||
        card.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (card.content && card.content.toLowerCase().includes(this.searchTerm.toLowerCase()));

      const matchesType = this.selectedCardType === 'all' || card.cardType === this.selectedCardType;

      return matchesSearch && matchesType;
    });
  }

  createNewCard(): void {
    this.currentCard = this.getEmptyCard();
    this.editMode = true;
  }

  createFromTemplate(template: CardTemplate): void {
    this.currentCard = {
      ...this.getEmptyCard(),
      title: template.title,
      cardType: template.cardType,
      content: template.content,
      mermaidDiagram: template.mermaidDiagram || ''
    };
    this.editMode = true;
  }

  editCard(card: ApplicationCard): void {
    this.currentCard = { ...card };
    this.editMode = true;
  }

  cloneCard(card: ApplicationCard): void {
    this.currentCard = {
      ...card,
      id: undefined,
      title: `${card.title} (Copy)`,
      createdAt: undefined,
      updatedAt: undefined
    };
    this.editMode = true;
    this.snackBar.open('Card cloned! Edit and save to create a new card.', 'Close', { duration: 3000 });
  }

  saveCard(): void {
    if (!this.currentCard.title || !this.currentCard.cardType) {
      this.snackBar.open('Please fill in required fields', 'Close', { duration: 3000 });
      return;
    }

    this.isSaving = true;
    const saveOperation = this.currentCard.id
      ? this.cardService.updateCard(this.applicationId, this.currentCard.id, this.currentCard)
      : this.cardService.createCard(this.applicationId, this.currentCard);

    saveOperation.subscribe({
      next: () => {
        this.snackBar.open('Card saved successfully', 'Close', { duration: 3000 });
        this.editMode = false;
        this.isSaving = false;
        this.hasUnsavedChanges = false;
        this.clearDraft();
        this.loadCards();
      },
      error: (error) => {
        console.error('Error saving card:', error);
        const errorMsg = error.error?.message || 'Error saving card. Please check your input and try again.';
        this.snackBar.open(errorMsg, 'Close', { duration: 5000 });
        this.isSaving = false;
      }
    });
  }

  deleteCardWithConfirmation(card: ApplicationCard): void {
    const confirmDelete = confirm(`Are you sure you want to delete the card "${card.title}"?`);
    if (!confirmDelete || !card.id) {
      return;
    }

    this.cardService.deleteCard(this.applicationId, card.id).subscribe({
      next: () => {
        this.snackBar.open('Card deleted successfully', 'Close', { duration: 3000 });
        this.loadCards();
      },
      error: (error) => {
        console.error('Error deleting card:', error);
        this.snackBar.open('Error deleting card. Please try again.', 'Close', { duration: 5000 });
      }
    });
  }

  cancelEditWithConfirmation(): void {
    if (this.hasUnsavedChanges) {
      const confirmCancel = confirm('You have unsaved changes. Are you sure you want to cancel?');
      if (!confirmCancel) {
        return;
      }
      this.clearDraft();
    }
    this.editMode = false;
    this.hasUnsavedChanges = false;
    this.currentCard = this.getEmptyCard();
  }

  exportCard(card: ApplicationCard): void {
    let markdown = `# ${card.title}\n\n`;
    markdown += `**Type:** ${card.cardType}\n\n`;

    if (card.content) {
      markdown += card.content + '\n\n';
    }

    if (card.mermaidDiagram) {
      markdown += '## Diagram\n\n```mermaid\n' + card.mermaidDiagram + '\n```\n\n';
    }

    markdown += `\n---\n*Created: ${card.createdAt}*\n`;
    markdown += `*Updated: ${card.updatedAt}*\n`;

    this.downloadFile(markdown, `${card.title.replace(/[^a-z0-9]/gi, '_')}.md`, 'text/markdown');
    this.snackBar.open('Card exported successfully', 'Close', { duration: 3000 });
  }

  exportAllCards(): void {
    let markdown = `# Application Documentation Cards\n\n`;
    markdown += `**Total Cards:** ${this.filteredCards.length}\n`;
    markdown += `**Exported:** ${new Date().toLocaleString()}\n\n`;
    markdown += `---\n\n`;

    this.filteredCards.forEach((card, index) => {
      markdown += `## ${index + 1}. ${card.title}\n\n`;
      markdown += `**Type:** ${card.cardType}\n\n`;

      if (card.content) {
        markdown += card.content + '\n\n';
      }

      if (card.mermaidDiagram) {
        markdown += '### Diagram\n\n```mermaid\n' + card.mermaidDiagram + '\n```\n\n';
      }

      markdown += `---\n\n`;
    });

    this.downloadFile(markdown, `application-cards-${this.applicationId}.md`, 'text/markdown');
    this.snackBar.open(`${this.filteredCards.length} cards exported successfully`, 'Close', { duration: 3000 });
  }

  toggleBulkSelect(): void {
    this.bulkSelectMode = !this.bulkSelectMode;
    if (!this.bulkSelectMode) {
      this.selectedCards.clear();
    }
  }

  toggleCardSelection(cardId: number): void {
    if (this.selectedCards.has(cardId)) {
      this.selectedCards.delete(cardId);
    } else {
      this.selectedCards.add(cardId);
    }
  }

  bulkDelete(): void {
    const confirmDelete = confirm(`Are you sure you want to delete ${this.selectedCards.size} card(s)?`);
    if (!confirmDelete) {
      return;
    }

    const deletePromises = Array.from(this.selectedCards).map(cardId =>
      this.cardService.deleteCard(this.applicationId, cardId).toPromise()
    );

    Promise.all(deletePromises).then(() => {
      this.snackBar.open(`${this.selectedCards.size} card(s) deleted successfully`, 'Close', { duration: 3000 });
      this.selectedCards.clear();
      this.bulkSelectMode = false;
      this.loadCards();
    }).catch(error => {
      console.error('Error deleting cards:', error);
      this.snackBar.open('Error deleting some cards. Please try again.', 'Close', { duration: 5000 });
    });
  }

  bulkToggleVisibility(visible: boolean): void {
    const updatePromises = Array.from(this.selectedCards).map(cardId => {
      const card = this.cards.find(c => c.id === cardId);
      if (card) {
        card.visible = visible;
        return this.cardService.updateCard(this.applicationId, cardId, card).toPromise();
      }
      return Promise.resolve();
    });

    Promise.all(updatePromises).then(() => {
      this.snackBar.open(`${this.selectedCards.size} card(s) updated successfully`, 'Close', { duration: 3000 });
      this.selectedCards.clear();
      this.bulkSelectMode = false;
      this.loadCards();
    }).catch(error => {
      console.error('Error updating cards:', error);
      this.snackBar.open('Error updating some cards. Please try again.', 'Close', { duration: 5000 });
    });
  }

  onCardChange(): void {
    this.hasUnsavedChanges = true;
    this.saveDraft();
  }

  saveDraft(): void {
    const draftKey = this.getDraftKey();
    localStorage.setItem(draftKey, JSON.stringify(this.currentCard));
  }

  loadDraft(): void {
    const draftKey = this.getDraftKey();
    const draft = localStorage.getItem(draftKey);
    if (draft) {
      try {
        const parsedDraft = JSON.parse(draft);
        const confirmRestore = confirm('Found an unsaved draft. Would you like to restore it?');
        if (confirmRestore) {
          this.currentCard = parsedDraft;
          this.editMode = true;
          this.hasUnsavedChanges = true;
        } else {
          this.clearDraft();
        }
      } catch (e) {
        console.error('Error loading draft:', e);
        this.clearDraft();
      }
    }
  }

  clearDraft(): void {
    const draftKey = this.getDraftKey();
    localStorage.removeItem(draftKey);
  }

  private getDraftKey(): string {
    return `${this.DRAFT_KEY_PREFIX}${this.applicationId}`;
  }

  renderMarkdown(content: string): string {
    if (!content) return '';
    try {
      return marked.parse(content) as string;
    } catch (error) {
      console.error('Error parsing markdown:', error);
      return content;
    }
  }

  initMermaid(): void {
    try {
      mermaid.run({
        querySelector: '.mermaid'
      });
    } catch (error) {
      console.error('Error initializing Mermaid:', error);
    }
  }

  getCardTypeIcon(cardType: string): string {
    const icons: { [key: string]: string } = {
      'overview': 'dashboard',
      'architecture': 'account_tree',
      'sequence': 'timeline',
      'deployment': 'cloud_upload',
      'dataflow': 'device_hub',
      'custom': 'note'
    };
    return icons[cardType] || 'note';
  }

  getRelativeTime(dateString?: string): string {
    if (!dateString) return 'recently';

    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  }

  private downloadFile(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    window.URL.revokeObjectURL(url);
  }

  private getEmptyCard(): ApplicationCard {
    return {
      applicationId: this.applicationId,
      title: '',
      cardType: 'overview',
      content: '',
      mermaidDiagram: '',
      sortOrder: 0,
      visible: true
    };
  }
}
