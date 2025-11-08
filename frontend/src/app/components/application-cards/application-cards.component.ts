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
import {
  CardType,
  CARD_TYPE_LABELS,
  CARD_TYPE_ICONS,
  CARD_TEMPLATES,
  CARD_TYPES,
  CardTemplate
} from '../../constants/card.constants';

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
              <mat-option *ngFor="let type of cardTypes" [value]="type">{{ getCardTypeLabel(type) }}</mat-option>
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
        </div>
      </div>

      <!-- Bulk Action Bar -->
      <div class="bulk-actions-bar" *ngIf="bulkSelectMode && selectedCards.size > 0">
        <span>{{ selectedCards.size }} card(s) selected</span>
        <div class="bulk-action-buttons">
          <button mat-button (click)="bulkSetVisibility(true)">
            <mat-icon>visibility</mat-icon>
            Show
          </button>
          <button mat-button (click)="bulkSetVisibility(false)">
            <mat-icon>visibility_off</mat-icon>
            Hide
          </button>
          <button mat-button color="warn" (click)="bulkDeleteCards()">
            <mat-icon>delete</mat-icon>
            Delete
          </button>
          <button mat-button (click)="toggleBulkSelectMode()">
            Cancel
          </button>
        </div>
      </div>

      <!-- Loading Spinner -->
      <div class="loading-container" *ngIf="loading">
        <mat-spinner></mat-spinner>
      </div>

      <!-- Empty State -->
      <div class="empty-state" *ngIf="!loading && cards.length === 0 && !editMode">
        <mat-icon>note_add</mat-icon>
        <h3>No Documentation Cards Yet</h3>
        <p>Start documenting your application by creating your first card.</p>
        <button mat-raised-button color="primary" (click)="createNewCard()">
          <mat-icon>add</mat-icon>
          Create First Card
        </button>
      </div>

      <!-- Cards Grid -->
      <div class="cards-grid" *ngIf="!loading && filteredCards.length > 0 && !editMode">
        <mat-card *ngFor="let card of filteredCards" class="application-card">
          <mat-card-header>
            <mat-checkbox
              *ngIf="bulkSelectMode"
              [checked]="selectedCards.has(card.id!)"
              (change)="toggleCardSelection(card.id!)"
              (click)="$event.stopPropagation()"
              class="bulk-select-checkbox">
            </mat-checkbox>
            <mat-card-title>{{ card.title }}</mat-card-title>
            <mat-card-subtitle>
              <mat-chip-set>
                <mat-chip>
                  <mat-icon class="chip-icon">{{ getCardTypeIcon(card.cardType) }}</mat-icon>
                  {{ getCardTypeLabel(card.cardType) }}</mat-chip>
                <mat-chip *ngIf="!card.visible">
                  <mat-icon class="chip-icon">visibility_off</mat-icon>
                  Hidden
                </mat-chip>
              </mat-chip-set>
            </mat-card-subtitle>
          </mat-card-header>
          <mat-card-content>
            <div class="card-preview">
              <div *ngIf="card.content" class="markdown-preview" [innerHTML]="renderMarkdown(card.content)"></div>
              <div *ngIf="card.mermaidDiagram" class="mermaid-preview">
                <div [id]="'mermaid-' + card.id" class="mermaid">{{ card.mermaidDiagram }}</div>
              </div>
            </div>
            <div class="card-metadata">
              <small>Updated {{ getRelativeTime(card.updatedAt) }}</small>
            </div>
          </mat-card-content>
          <mat-card-actions>
            <button mat-button color="primary" (click)="editCard(card)">
              <mat-icon>edit</mat-icon>
              Edit
            </button>
            <button mat-button [matMenuTriggerFor]="cardMenu">
              <mat-icon>more_vert</mat-icon>
            </button>
            <mat-menu #cardMenu="matMenu">
              <button mat-menu-item (click)="cloneCard(card)">
                <mat-icon>content_copy</mat-icon>
                Clone
              </button>
              <button mat-menu-item (click)="toggleCardVisibility(card)">
                <mat-icon>{{ card.visible ? 'visibility_off' : 'visibility' }}</mat-icon>
                {{ card.visible ? 'Hide' : 'Show' }}
              </button>
              <button mat-menu-item (click)="deleteCardWithConfirmation(card)">
                <mat-icon color="warn">delete</mat-icon>
                Delete
              </button>
            </mat-menu>
          </mat-card-actions>
        </mat-card>
      </div>

      <!-- No Filtered Results -->
      <div class="empty-state" *ngIf="!loading && cards.length > 0 && filteredCards.length === 0 && !editMode">
        <mat-icon>search_off</mat-icon>
        <h3>No Cards Found</h3>
        <p>No cards match your current filters.</p>
        <button mat-button (click)="clearFilters()">Clear Filters</button>
      </div>

      <!-- Edit Mode -->
      <div class="edit-container" *ngIf="editMode">
        <mat-card>
          <mat-card-header>
            <mat-card-title>{{ currentCard.id ? 'Edit' : 'Create' }} Card</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <div class="edit-form">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Title</mat-label>
                <input matInput [(ngModel)]="currentCard.title" (ngModelChange)="onCardChange()" required>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Card Type</mat-label>
                <mat-select [(ngModel)]="currentCard.cardType" (selectionChange)="onCardChange()" required>
                  <mat-option *ngFor="let type of cardTypes" [value]="type">
                    <mat-icon>{{ getCardTypeIcon(type) }}</mat-icon>
                    {{ getCardTypeLabel(type) }}
                  </mat-option>
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Content (Markdown)</mat-label>
                <textarea matInput [(ngModel)]="currentCard.content" (ngModelChange)="onCardChange()"
                          rows="10" placeholder="Enter markdown content..."></textarea>
              </mat-form-field>

              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Mermaid Diagram</mat-label>
                <textarea matInput [(ngModel)]="currentCard.mermaidDiagram" (ngModelChange)="onCardChange()"
                          rows="8" placeholder="graph TD&#10;    A[Start] --> B[End]"></textarea>
              </mat-form-field>

              <div class="form-row">
                <mat-form-field appearance="outline">
                  <mat-label>Sort Order</mat-label>
                  <input matInput type="number" [(ngModel)]="currentCard.sortOrder" (ngModelChange)="onCardChange()">
                </mat-form-field>

                <mat-checkbox [(ngModel)]="currentCard.visible" (ngModelChange)="onCardChange()">
                  Visible
                </mat-checkbox>
              </div>

              <!-- Preview Section -->
              <div class="preview-section" *ngIf="currentCard.content || currentCard.mermaidDiagram">
                <h3>Preview</h3>
                <div class="card-preview">
                  <div *ngIf="currentCard.content" class="markdown-preview" [innerHTML]="renderMarkdown(currentCard.content)"></div>
                  <div *ngIf="currentCard.mermaidDiagram" class="mermaid-preview">
                    <div id="mermaid-edit-preview" class="mermaid">{{ currentCard.mermaidDiagram }}</div>
                  </div>
                </div>
              </div>

              <!-- Unsaved Changes Warning -->
              <div class="unsaved-warning" *ngIf="hasUnsavedChanges">
                <mat-icon>warning</mat-icon>
                <span>You have unsaved changes</span>
              </div>
            </div>
          </mat-card-content>
          <mat-card-actions>
            <button mat-raised-button color="primary" (click)="saveCard()" [disabled]="isSaving || !currentCard.title || !currentCard.cardType">
              <mat-icon>save</mat-icon>
              {{ isSaving ? 'Saving...' : 'Save' }}
            </button>
            <button mat-button (click)="cancelEditWithConfirmation()">
              Cancel
            </button>
            <div class="keyboard-hints">
              <small>Ctrl+S to save | Esc to cancel</small>
            </div>
          </mat-card-actions>
        </mat-card>
      </div>

      <!-- Action Buttons -->
      <div class="action-buttons" *ngIf="!editMode && cards.length > 0">
        <button mat-button (click)="toggleBulkSelectMode()">
          <mat-icon>{{ bulkSelectMode ? 'close' : 'checklist' }}</mat-icon>
          {{ bulkSelectMode ? 'Cancel' : 'Bulk Select' }}
        </button>
        <button mat-button (click)="exportToMarkdown()">
          <mat-icon>download</mat-icon>
          Export All
        </button>
      </div>
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
      margin-bottom: 24px;
      flex-wrap: wrap;
      gap: 16px;
    }

    .cards-header h2 {
      margin: 0;
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .badge-icon {
      font-size: 24px;
      width: 24px;
      height: 24px;
    }

    .header-actions {
      display: flex;
      gap: 12px;
      align-items: center;
      flex-wrap: wrap;
    }

    .search-field, .filter-field {
      min-width: 200px;
    }

    .bulk-actions-bar {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      background: #f5f5f5;
      border-radius: 4px;
      margin-bottom: 16px;
    }

    .bulk-action-buttons {
      display: flex;
      gap: 8px;
    }

    .loading-container {
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
      color: #999;
      margin-bottom: 16px;
    }

    .cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 20px;
      margin-bottom: 24px;
    }

    .application-card {
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .application-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 16px rgba(0,0,0,0.1);
    }

    .bulk-select-checkbox {
      margin-right: 12px;
    }

    .chip-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
      margin-right: 4px;
    }

    .card-preview {
      max-height: 300px;
      overflow-y: auto;
      margin-bottom: 12px;
    }

    .markdown-preview {
      padding: 12px;
      background: #f9f9f9;
      border-radius: 4px;
      margin-bottom: 12px;
    }

    .markdown-preview h1 {
      font-size: 1.5em;
      margin-top: 0;
    }

    .markdown-preview h2 {
      font-size: 1.3em;
    }

    .markdown-preview code {
      background: #e8e8e8;
      padding: 2px 6px;
      border-radius: 3px;
    }

    .mermaid-preview {
      padding: 12px;
      background: white;
      border: 1px solid #e0e0e0;
      border-radius: 4px;
      overflow-x: auto;
    }

    .card-metadata {
      color: #666;
      font-size: 0.9em;
      padding-top: 8px;
      border-top: 1px solid #eee;
    }

    .edit-container {
      margin-bottom: 24px;
    }

    .edit-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .full-width {
      width: 100%;
    }

    .form-row {
      display: flex;
      gap: 16px;
      align-items: center;
    }

    .preview-section {
      margin-top: 24px;
      padding: 16px;
      background: #f9f9f9;
      border-radius: 4px;
    }

    .preview-section h3 {
      margin-top: 0;
    }

    .unsaved-warning {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px;
      background: #fff3cd;
      border-radius: 4px;
      color: #856404;
    }

    .keyboard-hints {
      margin-left: auto;
      color: #666;
    }

    .action-buttons {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      padding-top: 16px;
      border-top: 1px solid #eee;
    }

    .template-menu-item {
      display: flex;
      flex-direction: column;
    }

    .template-menu-item small {
      color: #666;
      font-size: 0.85em;
    }

    mat-card-header mat-icon {
      margin-right: 8px;
    }

    mat-select mat-option mat-icon {
      vertical-align: middle;
      margin-right: 8px;
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
  cardTypes = CARD_TYPES;
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
        card.content?.toLowerCase().includes(this.searchTerm.toLowerCase());

      const matchesType = this.selectedCardType === 'all' || card.cardType === this.selectedCardType;

      return matchesSearch && matchesType;
    });
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedCardType = 'all';
    this.applyFilters();
  }

  createNewCard(): void {
    this.currentCard = this.getEmptyCard();
    this.editMode = true;
    this.hasUnsavedChanges = false;
  }

  createFromTemplate(template: CardTemplate): void {
    this.currentCard = {
      applicationId: this.applicationId,
      title: template.title,
      cardType: template.cardType,
      content: template.content,
      mermaidDiagram: template.mermaidDiagram || '',
      sortOrder: 0,
      visible: true
    };
    this.editMode = true;
    this.hasUnsavedChanges = true;
    setTimeout(() => this.initMermaid(), 100);
  }

  editCard(card: ApplicationCard): void {
    this.currentCard = { ...card };
    this.editMode = true;
    this.hasUnsavedChanges = false;
    setTimeout(() => this.initMermaid(), 100);
  }

  onCardChange(): void {
    this.hasUnsavedChanges = true;
    this.saveDraft();
    setTimeout(() => this.initMermaid(), 100);
  }

  saveCard(): void {
    if (!this.currentCard.title || !this.currentCard.cardType) {
      this.snackBar.open('Please fill in all required fields', 'Close', { duration: 3000 });
      return;
    }

    this.isSaving = true;
    const saveOperation = this.currentCard.id
      ? this.cardService.updateCard(this.applicationId, this.currentCard.id, this.currentCard)
      : this.cardService.createCard(this.applicationId, this.currentCard);

    saveOperation.subscribe({
      next: () => {
        this.snackBar.open(`Card ${this.currentCard.id ? 'updated' : 'created'} successfully`, 'Close', { duration: 3000 });
        this.isSaving = false;
        this.editMode = false;
        this.hasUnsavedChanges = false;
        this.clearDraft();
        this.loadCards();
      },
      error: (error) => {
        console.error('Error saving card:', error);
        this.snackBar.open('Error saving card. Please try again.', 'Close', { duration: 5000 });
        this.isSaving = false;
      }
    });
  }

  cancelEditWithConfirmation(): void {
    if (this.hasUnsavedChanges) {
      if (confirm('You have unsaved changes. Are you sure you want to cancel?')) {
        this.editMode = false;
        this.hasUnsavedChanges = false;
        this.clearDraft();
      }
    } else {
      this.editMode = false;
    }
  }

  toggleCardVisibility(card: ApplicationCard): void {
    const updatedCard = { ...card, visible: !card.visible };
    this.cardService.updateCard(this.applicationId, card.id!, updatedCard).subscribe({
      next: () => {
        this.snackBar.open(`Card ${updatedCard.visible ? 'shown' : 'hidden'}`, 'Close', { duration: 2000 });
        this.loadCards();
      },
      error: (error) => {
        console.error('Error updating card visibility:', error);
        this.snackBar.open('Error updating card. Please try again.', 'Close', { duration: 5000 });
      }
    });
  }

  deleteCardWithConfirmation(card: ApplicationCard): void {
    if (confirm(`Are you sure you want to delete "${card.title}"?`)) {
      this.cardService.deleteCard(this.applicationId, card.id!).subscribe({
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
  }

  cloneCard(card: ApplicationCard): void {
    const clonedCard: ApplicationCard = {
      ...card,
      id: undefined,
      title: `${card.title} (Copy)`,
      sortOrder: card.sortOrder + 1
    };

    this.cardService.createCard(this.applicationId, clonedCard).subscribe({
      next: () => {
        this.snackBar.open('Card cloned successfully', 'Close', { duration: 3000 });
        this.loadCards();
      },
      error: (error) => {
        console.error('Error cloning card:', error);
        this.snackBar.open('Error cloning card. Please try again.', 'Close', { duration: 5000 });
      }
    });
  }

  toggleBulkSelectMode(): void {
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

  bulkSetVisibility(visible: boolean): void {
    const updatePromises: Promise<any>[] = [];

    this.selectedCards.forEach(cardId => {
      const card = this.cards.find(c => c.id === cardId);
      if (card) {
        const updatedCard = { ...card, visible };
        const promise = new Promise((resolve, reject) => {
          this.cardService.updateCard(this.applicationId, cardId, updatedCard).subscribe({
            next: resolve,
            error: reject
          });
        });
        updatePromises.push(promise);
      }
    });

    Promise.all(updatePromises).then(() => {
      this.snackBar.open(`${this.selectedCards.size} card(s) updated`, 'Close', { duration: 3000 });
      this.selectedCards.clear();
      this.bulkSelectMode = false;
      this.loadCards();
    }).catch(error => {
      console.error('Error in bulk update:', error);
      this.snackBar.open('Error updating some cards. Please try again.', 'Close', { duration: 5000 });
    });
  }

  bulkDeleteCards(): void {
    if (confirm(`Are you sure you want to delete ${this.selectedCards.size} card(s)?`)) {
      const deletePromises: Promise<any>[] = [];

      this.selectedCards.forEach(cardId => {
        const promise = new Promise((resolve, reject) => {
          this.cardService.deleteCard(this.applicationId, cardId).subscribe({
            next: resolve,
            error: reject
          });
        });
        deletePromises.push(promise);
      });

      Promise.all(deletePromises).then(() => {
        this.snackBar.open(`${this.selectedCards.size} card(s) deleted`, 'Close', { duration: 3000 });
        this.selectedCards.clear();
        this.bulkSelectMode = false;
        this.loadCards();
      }).catch(error => {
        console.error('Error in bulk delete:', error);
        this.snackBar.open('Error deleting some cards. Please try again.', 'Close', { duration: 5000 });
      });
    }
  }

  exportToMarkdown(): void {
    let markdown = `# Documentation Cards\n\n`;

    this.cards.forEach(card => {
      markdown += `## ${card.title}\n\n`;
      markdown += `**Type:** ${card.cardType}\n\n`;
      if (card.content) {
        markdown += `${card.content}\n\n`;
      }
      if (card.mermaidDiagram) {
        markdown += `### Diagram\n\n\`\`\`mermaid\n${card.mermaidDiagram}\n\`\`\`\n\n`;
      }
      markdown += `---\n\n`;
    });

    this.downloadFile(markdown, 'documentation-cards.md', 'text/markdown');
    this.snackBar.open('Cards exported successfully', 'Close', { duration: 3000 });
  }

  renderMarkdown(content: string): string {
    try {
      return marked.parse(content) as string;
    } catch (error) {
      console.error('Error rendering markdown:', error);
      return content;
    }
  }

  private initMermaid(): void {
    try {
      mermaid.contentLoaded();
    } catch (error) {
      console.error('Error initializing Mermaid:', error);
    }
  }

  getCardTypeIcon(cardType: string): string {
    return CARD_TYPE_ICONS[cardType as CardType] || 'note';
  }

  getCardTypeLabel(cardType: string): string {
    return CARD_TYPE_LABELS[cardType as CardType] || cardType;
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
      cardType: CardType.OVERVIEW,
      content: '',
      mermaidDiagram: '',
      sortOrder: 0,
      visible: true
    };
  }

  private getDraftKey(): string {
    return `${this.DRAFT_KEY_PREFIX}${this.applicationId}`;
  }

  private saveDraft(): void {
    const draftKey = this.getDraftKey();
    localStorage.setItem(draftKey, JSON.stringify(this.currentCard));
  }

  private loadDraft(): void {
    const draftKey = this.getDraftKey();
    const draft = localStorage.getItem(draftKey);
    if (draft) {
      try {
        const parsedDraft = JSON.parse(draft);
        if (parsedDraft.applicationId === this.applicationId) {
          this.currentCard = parsedDraft;
          this.hasUnsavedChanges = true;
          this.editMode = true;
          this.snackBar.open('Restored unsaved draft', 'Dismiss', { duration: 3000 });
        }
      } catch (error) {
        console.error('Error loading draft:', error);
      }
    }
  }

  private clearDraft(): void {
    const draftKey = this.getDraftKey();
    localStorage.removeItem(draftKey);
  }
}
