import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ApplicationService } from '../../services/application.service';
import { Application } from '../../models/application.model';

@Component({
  selector: 'app-shared-components',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatTableModule,
    MatProgressSpinnerModule
  ],
  template: `
    <h1>Shared Components</h1>

    <div *ngIf="loading" class="loading-spinner">
      <mat-spinner></mat-spinner>
    </div>

    <mat-card *ngIf="!loading">
      <mat-card-content>
        <p>These are reusable building blocks used across multiple applications (e.g., KeyCloak for SSO, shared databases, etc.)</p>

        <table mat-table [dataSource]="sharedComponents" class="mat-elevation-z0">
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Name</th>
            <td mat-cell *matCellDef="let app">
              <a [routerLink]="['/applications', app.id]">{{ app.name }}</a>
            </td>
          </ng-container>

          <ng-container matColumnDef="description">
            <th mat-header-cell *matHeaderCellDef>Description</th>
            <td mat-cell *matCellDef="let app">{{ app.description || 'N/A' }}</td>
          </ng-container>

          <ng-container matColumnDef="department">
            <th mat-header-cell *matHeaderCellDef>Maintained By</th>
            <td mat-cell *matCellDef="let app">{{ app.department || 'N/A' }}</td>
          </ng-container>

          <ng-container matColumnDef="version">
            <th mat-header-cell *matHeaderCellDef>Version</th>
            <td mat-cell *matCellDef="let app">{{ app.currentVersion }}</td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>

        <div *ngIf="sharedComponents.length === 0" style="text-align: center; padding: 20px;">
          <p>No shared components found.</p>
        </div>
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    table {
      width: 100%;
    }

    a {
      color: #3f51b5;
      text-decoration: none;
      font-weight: 500;
    }

    a:hover {
      text-decoration: underline;
    }
  `]
})
export class SharedComponentsComponent implements OnInit {
  sharedComponents: Application[] = [];
  displayedColumns: string[] = ['name', 'description', 'department', 'version'];
  loading = true;

  constructor(private applicationService: ApplicationService) {}

  ngOnInit(): void {
    this.loadSharedComponents();
  }

  loadSharedComponents(): void {
    this.applicationService.getSharedComponents().subscribe({
      next: (apps) => {
        this.sharedComponents = apps;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading shared components:', error);
        this.loading = false;
      }
    });
  }
}
