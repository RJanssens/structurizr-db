import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TechnologyStackService } from '../../services/technology-stack.service';
import { TechnologyStack } from '../../models/application.model';

@Component({
  selector: 'app-technology-overview',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatTableModule,
    MatProgressSpinnerModule
  ],
  template: `
    <h1>Technology Overview</h1>

    <mat-card>
      <mat-card-content>
        <mat-form-field appearance="outline" style="width: 300px;">
          <mat-label>Select Technology</mat-label>
          <mat-select [(ngModel)]="selectedTechnology" (selectionChange)="onTechnologyChange()">
            <mat-option *ngFor="let tech of technologies" [value]="tech">
              {{ tech }}
            </mat-option>
          </mat-select>
        </mat-form-field>
      </mat-card-content>
    </mat-card>

    <div *ngIf="loading" class="loading-spinner">
      <mat-spinner></mat-spinner>
    </div>

    <mat-card *ngIf="!loading && selectedTechnology">
      <mat-card-header>
        <mat-card-title>Applications Using {{ selectedTechnology }}</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <table mat-table [dataSource]="techStacks" class="mat-elevation-z0">
          <ng-container matColumnDef="application">
            <th mat-header-cell *matHeaderCellDef>Application ID</th>
            <td mat-cell *matCellDef="let tech">{{ tech.applicationId }}</td>
          </ng-container>

          <ng-container matColumnDef="version">
            <th mat-header-cell *matHeaderCellDef>Version</th>
            <td mat-cell *matCellDef="let tech">{{ tech.version || 'N/A' }}</td>
          </ng-container>

          <ng-container matColumnDef="category">
            <th mat-header-cell *matHeaderCellDef>Category</th>
            <td mat-cell *matCellDef="let tech">{{ tech.category || 'N/A' }}</td>
          </ng-container>

          <ng-container matColumnDef="detectionSource">
            <th mat-header-cell *matHeaderCellDef>Detection Source</th>
            <td mat-cell *matCellDef="let tech">{{ tech.detectionSource || 'N/A' }}</td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>

        <div *ngIf="techStacks.length === 0" style="text-align: center; padding: 20px;">
          <p>No applications found using this technology.</p>
        </div>
      </mat-card-content>
    </mat-card>

    <mat-card *ngIf="!loading && !selectedTechnology">
      <mat-card-content style="text-align: center; padding: 40px;">
        <p>Select a technology to see which applications use it.</p>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    table {
      width: 100%;
    }
  `]
})
export class TechnologyOverviewComponent implements OnInit {
  technologies: string[] = [];
  selectedTechnology?: string;
  techStacks: TechnologyStack[] = [];
  displayedColumns: string[] = ['application', 'version', 'category', 'detectionSource'];
  loading = false;

  constructor(private technologyStackService: TechnologyStackService) {}

  ngOnInit(): void {
    this.loadTechnologies();
  }

  loadTechnologies(): void {
    this.technologyStackService.getAllTechnologies().subscribe({
      next: (techs) => {
        this.technologies = techs;
      },
      error: (error) => {
        console.error('Error loading technologies:', error);
      }
    });
  }

  onTechnologyChange(): void {
    if (this.selectedTechnology) {
      this.loading = true;
      this.technologyStackService.findByTechnology(this.selectedTechnology).subscribe({
        next: (stacks) => {
          this.techStacks = stacks;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading technology stacks:', error);
          this.loading = false;
        }
      });
    }
  }
}
