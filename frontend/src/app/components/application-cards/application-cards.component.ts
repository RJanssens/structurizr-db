import { Component, Input, OnInit, OnChanges, SimpleChanges, AfterViewInit } from '@angular/core';
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
import { ApplicationCardService } from '../../services/application-card.service';
import { ApplicationCard } from '../../models/application.model';
import { marked } from 'marked';
import mermaid from 'mermaid';

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
    MatSnackBarModule
  ],
  template: `
    <div class="cards-container">
      <div class="cards-header">
        <h2>Documentation Cards</h2>
        <button mat-raised-button color="primary" (click)="createNewCard()">
          <mat-icon>add</mat-icon>
          New Card
        </button>
      </div>

      <div *ngIf="!editMode && cards.length === 0" class="empty-state">
        <mat-icon>description</mat-icon>
        <p>No cards yet. Create your first documentation card!</p>
      </div>

      <div *ngIf="!editMode && cards.length > 0" class="cards-grid">
        <mat-card *ngFor="let card of cards" class="card-item">
          <mat-card-header>
            <mat-card-title>{{ card.title }}</mat-card-title>
            <mat-card-subtitle>
              <mat-chip>{{ card.cardType }}</mat-chip>
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
            <button mat-button color="warn" (click)="deleteCard(card)">
              <mat-icon>delete</mat-icon>
              Delete
            </button>
          </mat-card-actions>
        </mat-card>
      </div>

      <mat-card *ngIf="editMode" class="editor-card">
        <mat-card-header>
          <mat-card-title>{{ currentCard.id ? 'Edit Card' : 'New Card' }}</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <div class="form-grid">
            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Title</mat-label>
              <input matInput [(ngModel)]="currentCard.title" placeholder="Card title" required>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Card Type</mat-label>
              <mat-select [(ngModel)]="currentCard.cardType" required>
                <mat-option value="overview">Overview</mat-option>
                <mat-option value="architecture">Architecture</mat-option>
                <mat-option value="sequence">Sequence Diagram</mat-option>
                <mat-option value="deployment">Deployment</mat-option>
                <mat-option value="dataflow">Data Flow</mat-option>
                <mat-option value="custom">Custom</mat-option>
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Content (Markdown supported)</mat-label>
              <textarea matInput [(ngModel)]="currentCard.content"
                        rows="10"
                        placeholder="Write your content here. Markdown is supported."></textarea>
              <mat-hint>Use Markdown syntax for formatting</mat-hint>
            </mat-form-field>

            <mat-form-field appearance="outline" class="full-width">
              <mat-label>Mermaid Diagram</mat-label>
              <textarea matInput [(ngModel)]="currentCard.mermaidDiagram"
                        rows="10"
                        placeholder="graph TD&#10;  A[Start] --> B[Process]&#10;  B --> C[End]"></textarea>
              <mat-hint>Use Mermaid syntax for diagrams</mat-hint>
            </mat-form-field>

            <mat-form-field appearance="outline">
              <mat-label>Sort Order</mat-label>
              <input matInput type="number" [(ngModel)]="currentCard.sortOrder" placeholder="0">
            </mat-form-field>
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
          <button mat-raised-button color="primary" (click)="saveCard()">
            <mat-icon>save</mat-icon>
            Save
          </button>
          <button mat-button (click)="cancelEdit()">
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
    }

    .card-content {
      margin-bottom: 15px;
      line-height: 1.6;
    }

    .mermaid-container {
      margin-top: 15px;
      padding: 10px;
      background: #f5f5f5;
      border-radius: 4px;
    }

    .editor-card {
      margin-top: 20px;
    }

    .form-grid {
      display: flex;
      flex-direction: column;
      gap: 15px;
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
    }

    mat-card-actions {
      padding: 16px;
      display: flex;
      gap: 10px;
    }
  `]
})
export class ApplicationCardsComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() applicationId!: number;

  cards: ApplicationCard[] = [];
  editMode = false;
  currentCard: ApplicationCard = this.getEmptyCard();

  constructor(
    private cardService: ApplicationCardService,
    private snackBar: MatSnackBar
  ) {
    // Initialize Mermaid
    mermaid.initialize({
      startOnLoad: true,
      theme: 'default',
      securityLevel: 'loose'
    });
  }

  ngOnInit(): void {
    if (this.applicationId) {
      this.loadCards();
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

  loadCards(): void {
    this.cardService.getCards(this.applicationId, true).subscribe({
      next: (cards) => {
        this.cards = cards;
        // Initialize Mermaid diagrams after loading
        setTimeout(() => this.initMermaid(), 100);
      },
      error: (error) => {
        console.error('Error loading cards:', error);
        this.snackBar.open('Error loading cards', 'Close', { duration: 3000 });
      }
    });
  }

  createNewCard(): void {
    this.currentCard = this.getEmptyCard();
    this.editMode = true;
  }

  editCard(card: ApplicationCard): void {
    this.currentCard = { ...card };
    this.editMode = true;
  }

  saveCard(): void {
    if (!this.currentCard.title || !this.currentCard.cardType) {
      this.snackBar.open('Please fill in required fields', 'Close', { duration: 3000 });
      return;
    }

    const saveOperation = this.currentCard.id
      ? this.cardService.updateCard(this.applicationId, this.currentCard.id, this.currentCard)
      : this.cardService.createCard(this.applicationId, this.currentCard);

    saveOperation.subscribe({
      next: () => {
        this.snackBar.open('Card saved successfully', 'Close', { duration: 3000 });
        this.editMode = false;
        this.loadCards();
      },
      error: (error) => {
        console.error('Error saving card:', error);
        this.snackBar.open('Error saving card', 'Close', { duration: 3000 });
      }
    });
  }

  deleteCard(card: ApplicationCard): void {
    if (!card.id || !confirm('Are you sure you want to delete this card?')) {
      return;
    }

    this.cardService.deleteCard(this.applicationId, card.id).subscribe({
      next: () => {
        this.snackBar.open('Card deleted successfully', 'Close', { duration: 3000 });
        this.loadCards();
      },
      error: (error) => {
        console.error('Error deleting card:', error);
        this.snackBar.open('Error deleting card', 'Close', { duration: 3000 });
      }
    });
  }

  cancelEdit(): void {
    this.editMode = false;
    this.currentCard = this.getEmptyCard();
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
